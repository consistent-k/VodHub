import os from 'os';

const getLocalhostAddress = () => {
    const interfaces = os.networkInterfaces();
    const address = Object.keys(interfaces)
        .flatMap((name) => interfaces[name] ?? [])
        .filter((iface) => iface?.family === 'IPv4' && !iface.internal)
        .map((iface) => iface?.address)
        .filter(Boolean);
    address.push('[::]');
    return address;
};

export { getLocalhostAddress };
