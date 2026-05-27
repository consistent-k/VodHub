#!/usr/bin/env bash
set -e

if [[ "${CLASH_ENABLED}" = "true" && -n "${CLASH_SUBSCRIBE_URL}" ]]; then
  echo "=============================================="
  echo "  Setting up Clash proxy..."
  echo "  Kernel: ${CLASH_KERNEL_NAME:-mihomo}"
  echo "=============================================="

  CLASH_KERNEL_NAME="${CLASH_KERNEL_NAME:-mihomo}"
  CLASH_BASE_DIR="${CLASH_BASE_DIR:-$HOME/clashctl}"

  # Download installer repo with mirror fallback
  echo "[Clash] Downloading installer..."
  INSTALLER_URLS=(
    "https://gh-proxy.org/https://github.com/nelvko/clash-for-linux-install/archive/refs/heads/master.tar.gz"
    "https://github.com/nelvko/clash-for-linux-install/archive/refs/heads/master.tar.gz"
  )
  for url in "${INSTALLER_URLS[@]}"; do
    if curl -fsSL --connect-timeout 15 --max-time 60 "$url" \
      -o /tmp/clash-install.tar.gz 2>/dev/null; then
      echo "[Clash] Installer downloaded from: $url"
      break
    fi
  done
  if [[ ! -f /tmp/clash-install.tar.gz ]]; then
    echo "[Clash] WARNING: Failed to download installer from all mirrors"
    echo "[Clash] Skipping proxy setup"
  else
    mkdir -p /tmp/clash-install
    tar -xzf /tmp/clash-install.tar.gz -C /tmp/clash-install --strip-components=1
    cd /tmp/clash-install

    # Write .env (use gh-proxy for GitHub downloads behind GFW)
    cat >.env <<EOF
KERNEL_NAME=${CLASH_KERNEL_NAME}
CLASH_BASE_DIR=${CLASH_BASE_DIR}
CLASH_CONFIG_URL=${CLASH_SUBSCRIBE_URL}
CLASH_SUB_UA=clash-verge/v2.4.0
INIT_TYPE=nohup
URL_GH_PROXY=https://gh-proxy.org
URL_CLASH_UI=http://board.zash.run.place
VERSION_MIHOMO=v1.19.17
VERSION_YQ=v4.49.2
VERSION_SUBCONVERTER=v0.9.0
EOF

    # Create minimal initial config so _merge_config passes during install
    mkdir -p resources
    cat >resources/config.yaml <<'YAML'
port: 7890
socks-port: 7891
mixed-port: 7890
allow-lan: false
mode: rule
log-level: info
external-controller: 127.0.0.1:9090
YAML
    cat >resources/mixin.yaml <<'YAML'
{}
YAML

    # Patch common.sh for Docker
    sed -i 's/--max-time 5/--max-time 30/g' scripts/cmd/common.sh
    sed -i 's/--retry 1/--retry 3 --connect-timeout 15/g' scripts/cmd/common.sh
    cat >>scripts/cmd/common.sh <<'PATCH'
_quit() { return 0; }
_error_quit() { echo "[Clash] ERROR: $1"; return 1; }
_apply_rc() { return 0; }
PATCH

    # Patch install.sh: skip _quit call at end
    sed -i 's/^_quit "/: # _quit "/' install.sh

    # Run installer with retries
    INSTALL_OK=false
    for i in 1 2 3; do
      echo "[Clash] Running installer (attempt $i/3)..."
      if bash install.sh "${CLASH_KERNEL_NAME}" 2>&1; then
        INSTALL_OK=true
        break
      fi
      echo "[Clash] Attempt $i failed, retrying in 3s..."
      sleep 3
    done

    # If yq is missing (common TLS issue), try to download it directly
    YQ_PATH="${CLASH_BASE_DIR}/bin/yq"
    if [[ ! -f "$YQ_PATH" ]]; then
      echo "[Clash] yq binary missing, downloading directly..."
      YQ_ARCH=$(uname -m)
      case "$YQ_ARCH" in
        x86_64)  YQ_ARCH_SUFFIX="amd64" ;;
        aarch64) YQ_ARCH_SUFFIX="arm64" ;;
        armv7l)  YQ_ARCH_SUFFIX="arm" ;;
        *)       YQ_ARCH_SUFFIX="$YQ_ARCH" ;;
      esac
      YQ_URLS=(
        "https://gh-proxy.org/https://github.com/mikefarah/yq/releases/download/v4.49.2/yq_linux_${YQ_ARCH_SUFFIX}.tar.gz"
        "https://github.com/mikefarah/yq/releases/download/v4.49.2/yq_linux_${YQ_ARCH_SUFFIX}.tar.gz"
      )
      for yq_url in "${YQ_URLS[@]}"; do
        if curl -fsL --connect-timeout 15 --max-time 60 "$yq_url" \
          -o /tmp/yq.tar.gz 2>/dev/null; then
          mkdir -p "$(dirname "$YQ_PATH")"
          tar -xzf /tmp/yq.tar.gz -C "$(dirname "$YQ_PATH")" 2>/dev/null
          mv "$(dirname "$YQ_PATH")"/yq_* "$YQ_PATH" 2>/dev/null || true
          chmod +x "$YQ_PATH"
          echo "[Clash] yq downloaded successfully"
          break
        fi
      done
    fi

    # Source installed clashctl
    if [[ -f "${CLASH_BASE_DIR}/scripts/cmd/clashctl.sh" ]]; then
      source "${CLASH_BASE_DIR}/scripts/cmd/clashctl.sh"

      # Add subscription
      echo "[Clash] Adding subscription..."
      clashsub add "${CLASH_SUBSCRIBE_URL}" 2>&1 || true
      sleep 1

      # Activate subscription
      echo "[Clash] Activating subscription..."
      if [[ -f "${CLASH_BASE_DIR}/resources/profiles.yaml" ]]; then
        USE_ID=$("${BIN_YQ}" '.use // 1' "${CLASH_PROFILES_META}" 2>/dev/null || echo 1)
        clashsub use "${USE_ID}" 2>&1 || true
      else
        clashsub use 1 2>&1 || true
      fi
      sleep 2

      # Start proxy
      echo "[Clash] Starting proxy..."
      clashon 2>&1 || true

      # Wait for mihomo to be ready
      echo "[Clash] Waiting for mihomo to start..."
      for _i in $(seq 1 10); do
        if pgrep -f "${CLASH_BASE_DIR}/bin/mihomo" >/dev/null 2>&1; then
          echo "[Clash] mihomo is running"
          break
        fi
        sleep 1
      done
      if ! pgrep -f "${CLASH_BASE_DIR}/bin/mihomo" >/dev/null 2>&1; then
        echo "[Clash] WARNING: mihomo failed to start after 10s"
      fi

      # Enable system proxy (sets http_proxy/https_proxy env vars)
      echo "[Clash] Setting proxy environment..."
      clashproxy on 2>&1 || true
    else
      echo "[Clash] WARNING: clashctl not found at ${CLASH_BASE_DIR}"
    fi

    echo "[Clash] Proxy environment ready"
  fi
fi

# Fallback: ensure proxy env vars are set if clashproxy on did not take effect
# Only set fallback if mihomo is actually running, otherwise proxy would just cause timeouts
CLASH_BIN="${CLASH_BASE_DIR:-$HOME/clashctl}/bin/mihomo"
if [ -n "${http_proxy:-}" ] || [ -n "${HTTP_PROXY:-}" ]; then
  : # already set by clashproxy
elif pgrep -f "$CLASH_BIN" >/dev/null 2>&1; then
  export http_proxy=http://127.0.0.1:7890
  export https_proxy=http://127.0.0.1:7890
  export HTTP_PROXY=http://127.0.0.1:7890
  export HTTPS_PROXY=http://127.0.0.1:7890
  export ALL_PROXY=http://127.0.0.1:7890
  export all_proxy=http://127.0.0.1:7890
  echo "[Clash] Fallback proxy env vars applied"
else
  echo "[Clash] mihomo not running, skipping proxy env vars"
fi

cd /app
exec "$@"