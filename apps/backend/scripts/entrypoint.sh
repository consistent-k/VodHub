#!/usr/bin/env bash
set -e

# ========================================
# 清除宿主机传入的代理环境变量，防止 Node 服务误用宿主机代理
# ========================================
unset http_proxy HTTP_PROXY https_proxy HTTPS_PROXY all_proxy ALL_PROXY no_proxy NO_PROXY
echo "[Entry] Cleared host proxy environment variables"

if [[ "${CLASH_ENABLED}" = "true" && -n "${CLASH_SUBSCRIBE_URL}" ]]; then
  echo "=============================================="
  echo "  Setting up Clash proxy..."
  echo "=============================================="

  CLASH_BASE_DIR="${CLASH_BASE_DIR:-$HOME/clashctl}"

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
      USE_ID=$(yq '.use // 1' "${CLASH_PROFILES_META}" 2>/dev/null || echo 1)
      clashsub use "${USE_ID}" 2>&1 || true
    else
      clashsub use 1 2>&1 || true
    fi
    sleep 2

    # Start mihomo directly (clashon may not work in Docker)
    echo "[Clash] Starting mihomo..."
    CLASH_BIN="${CLASH_BASE_DIR}/bin/mihomo"
    CLASH_CONFIG="${CLASH_BASE_DIR}/resources/config.yaml"
    if [[ -x "$CLASH_BIN" && -s "$CLASH_CONFIG" ]]; then
      nohup "$CLASH_BIN" -d "${CLASH_BASE_DIR}/resources" -f "$CLASH_CONFIG" \
        < /dev/null > /var/log/mihomo.log 2>&1 &
    fi

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

    # ========================================
    # 验证容器内代理是否可用
    # ========================================
    echo "[Clash] Verifying proxy connectivity..."
    PROXY_OK=false
    for _i in $(seq 1 5); do
      if curl -sS --max-time 10 --proxy http://127.0.0.1:7890 https://www.google.com -o /dev/null 2>/dev/null; then
        PROXY_OK=true
        break
      fi
      echo "[Clash] Proxy check attempt $_i failed, retrying..."
      sleep 2
    done
    if $PROXY_OK; then
      echo "[Clash] ✅ Proxy is working (127.0.0.1:7890)"
    else
      echo "[Clash] ❌ Proxy is NOT reachable, removing proxy env vars"
      unset http_proxy HTTP_PROXY https_proxy HTTPS_PROXY all_proxy ALL_PROXY
    fi
  else
    echo "[Clash] WARNING: clashctl not found at ${CLASH_BASE_DIR}"
  fi

  echo "[Clash] Proxy environment ready"
fi

# Fallback: ensure proxy env vars if mihomo is running and proxy env not yet set
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
