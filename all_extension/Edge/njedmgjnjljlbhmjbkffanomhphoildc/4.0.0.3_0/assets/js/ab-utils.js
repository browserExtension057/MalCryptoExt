const isab = buf => buf instanceof ArrayBuffer || (typeof buf === 'object' && buf.buffer instanceof ArrayBuffer);

const str2ab = {
  hex(str) {
    return new Uint8Array(str.match(/.{1,2}/g).map(byte => parseInt(byte, 16))).buffer;
  },
  b64(str) {
    return new Uint8Array([...atob(str)].map(char => char.charCodeAt(0))).buffer;
  },
  utf8(str) {
    let out = [], p = 0;
    for (let i = 0; i < str.length; i++) {
      const c = str.charCodeAt(i);
      if (c < 128) {
        out[p++] = c;
      } else if (c < 2048) {
        out[p++] = (c >> 6) | 192;
        out[p++] = (c & 63) | 128;
      } else if (((c & 0xFC00) == 0xD800) && (i + 1) < str.length && ((str.charCodeAt(i + 1) & 0xFC00) == 0xDC00)) {
        c = 0x10000 + ((c & 0x03FF) << 10) + (str.charCodeAt(++i) & 0x03FF);
        out[p++] = (c >> 18) | 240;
        out[p++] = ((c >> 12) & 63) | 128;
        out[p++] = ((c >> 6) & 63) | 128;
        out[p++] = (c & 63) | 128;
      } else {
        out[p++] = (c >> 12) | 224;
        out[p++] = ((c >> 6) & 63) | 128;
        out[p++] = (c & 63) | 128;
      }
    }
    return new Uint8Array(out).buffer;
  }
};

const ab2str = {
  hex(bytes) {
    return Array.prototype.map.call(new Uint8Array(bytes), x => ('00' + x.toString(16)).slice(-2)).join('');
  },
  b64(bytes) {
    if (bytes instanceof ArrayBuffer) bytes = new Uint8Array(bytes);
    return btoa(String.fromCharCode(...bytes));
  },
  utf8(bytes) {
    if (bytes instanceof ArrayBuffer) bytes = new Uint8Array(bytes);
    let out = [], pos = 0, c = 0;
    const len = bytes.length || bytes.byteLength;
    while (pos < len) {
      const c1 = bytes[pos++];
      if (c1 < 128) {
        out[c++] = String.fromCharCode(c1);
      } else if (c1 > 191 && c1 < 224) {
        const c2 = bytes[pos++];
        out[c++] = String.fromCharCode((c1 & 31) << 6 | c2 & 63);
      } else if (c1 > 239 && c1 < 365) {
        const c2 = bytes[pos++];
        const c3 = bytes[pos++];
        const c4 = bytes[pos++];
        const u = ((c1 & 7) << 18 | (c2 & 63) << 12 | (c3 & 63) << 6 | c4 & 63) - 0x10000;
        out[c++] = String.fromCharCode(0xD800 + (u >> 10));
        out[c++] = String.fromCharCode(0xDC00 + (u & 1023));
      } else {
        const c2 = bytes[pos++];
        const c3 = bytes[pos++];
        out[c++] = String.fromCharCode((c1 & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
      }
    }
    return out.join('');
  }
}

