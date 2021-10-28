/**
 * Minified by jsDelivr using UglifyJS v3.4.1.
 * Original file: /npm/js-sha256@0.9.0/src/sha256.js
 *
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */
let sha256js
!function () {
    "use strict";
    let ERROR = "input is invalid type", WINDOW = "object" == typeof window, root = WINDOW ? window : {};
    root.JS_SHA256_NO_WINDOW && (WINDOW = !1);
    let WEB_WORKER = !WINDOW && "object" == typeof self,
        NODE_JS = !root.JS_SHA256_NO_NODE_JS && "object" == typeof process && process.versions && process.versions.node;
    NODE_JS ? root = global : WEB_WORKER && (root = self);
    let COMMON_JS = !root.JS_SHA256_NO_COMMON_JS && "object" == typeof module && module.exports,
        AMD = "function" == typeof define && define.amd,
        ARRAY_BUFFER = !root.JS_SHA256_NO_ARRAY_BUFFER && "undefined" != typeof ArrayBuffer,
        HEX_CHARS = "0123456789abcdef".split(""), EXTRA = [-2147483648, 8388608, 32768, 128], SHIFT = [24, 16, 8, 0],
        K = [1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298],
        OUTPUT_TYPES = ["hex", "array", "digest", "arrayBuffer"], blocks = [];
    !root.JS_SHA256_NO_NODE_JS && Array.isArray || (Array.isArray = function (t) {
        return "[object Array]" === Object.prototype.toString.call(t)
    }), !ARRAY_BUFFER || !root.JS_SHA256_NO_ARRAY_BUFFER_IS_VIEW && ArrayBuffer.isView || (ArrayBuffer.isView = function (t) {
        return "object" == typeof t && t.buffer && t.buffer.constructor === ArrayBuffer
    });
    let createOutputMethod = function (h, r) {
        return function (t) {
            return new Sha256(r, !0).update(t)[h]()
        }
    }, createMethod = function (t) {
        let h = createOutputMethod("hex", t);
        NODE_JS && (h = nodeWrap(h, t)), h.create = function () {
            return new Sha256(t)
        }, h.update = function (t) {
            return h.create().update(t)
        };
        for (let r = 0; r < OUTPUT_TYPES.length; ++r) {
            let e = OUTPUT_TYPES[r];
            h[e] = createOutputMethod(e, t)
        }
        return h
    }, nodeWrap = function (method, is224) {
        let crypto = eval("require('crypto')"), Buffer = eval("require('buffer').Buffer"),
            algorithm = is224 ? "sha224" : "sha256", nodeMethod = function (t) {
                if ("string" == typeof t) return crypto.createHash(algorithm).update(t, "utf8").digest("hex");
                if (null == t) throw new Error(ERROR);
                return t.constructor === ArrayBuffer && (t = new Uint8Array(t)), Array.isArray(t) || ArrayBuffer.isView(t) || t.constructor === Buffer ? crypto.createHash(algorithm).update(new Buffer(t)).digest("hex") : method(t)
            };
        return nodeMethod
    }, createHmacOutputMethod = function (r, e) {
        return function (t, h) {
            return new HmacSha256(t, e, !0).update(h)[r]()
        }
    }, createHmacMethod = function (h) {
        let r = createHmacOutputMethod("hex", h);
        r.create = function (t) {
            return new HmacSha256(t, h)
        }, r.update = function (t, h) {
            return r.create(t).update(h)
        };
        for (let t = 0; t < OUTPUT_TYPES.length; ++t) {
            let e = OUTPUT_TYPES[t];
            r[e] = createHmacOutputMethod(e, h)
        }
        return r
    };

    function Sha256(t, h) {
        h ? (blocks[0] = blocks[16] = blocks[1] = blocks[2] = blocks[3] = blocks[4] = blocks[5] = blocks[6] = blocks[7] = blocks[8] = blocks[9] = blocks[10] = blocks[11] = blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0, this.blocks = blocks) : this.blocks = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], t ? (this.h0 = 3238371032, this.h1 = 914150663, this.h2 = 812702999, this.h3 = 4144912697, this.h4 = 4290775857, this.h5 = 1750603025, this.h6 = 1694076839, this.h7 = 3204075428) : (this.h0 = 1779033703, this.h1 = 3144134277, this.h2 = 1013904242, this.h3 = 2773480762, this.h4 = 1359893119, this.h5 = 2600822924, this.h6 = 528734635, this.h7 = 1541459225), this.block = this.start = this.bytes = this.hBytes = 0, this.finalized = this.hashed = !1, this.first = !0, this.is224 = t
    }

    function HmacSha256(t, h, r) {
        let e, s = typeof t;
        if ("string" === s) {
            let i, o = [], a = t.length, H = 0;
            for (e = 0; e < a; ++e) (i = t.charCodeAt(e)) < 128 ? o[H++] = i : (i < 2048 ? o[H++] = 192 | i >> 6 : (i < 55296 || 57344 <= i ? o[H++] = 224 | i >> 12 : (i = 65536 + ((1023 & i) << 10 | 1023 & t.charCodeAt(++e)), o[H++] = 240 | i >> 18, o[H++] = 128 | i >> 12 & 63), o[H++] = 128 | i >> 6 & 63), o[H++] = 128 | 63 & i);
            t = o
        } else {
            if ("object" !== s) throw new Error(ERROR);
            if (null === t) throw new Error(ERROR);
            if (ARRAY_BUFFER && t.constructor === ArrayBuffer) t = new Uint8Array(t); else if (!(Array.isArray(t) || ARRAY_BUFFER && ArrayBuffer.isView(t))) throw new Error(ERROR)
        }
        64 < t.length && (t = new Sha256(h, !0).update(t).array());
        let n = [], S = [];
        for (e = 0; e < 64; ++e) {
            let c = t[e] || 0;
            n[e] = 92 ^ c, S[e] = 54 ^ c
        }
        Sha256.call(this, h, r), this.update(S), this.oKeyPad = n, this.inner = !0, this.sharedMemory = r
    }

    Sha256.prototype.update = function (t) {
        if (!this.finalized) {
            let h, r = typeof t;
            if ("string" !== r) {
                if ("object" !== r) throw new Error(ERROR);
                if (null === t) throw new Error(ERROR);
                if (ARRAY_BUFFER && t.constructor === ArrayBuffer) t = new Uint8Array(t); else if (!(Array.isArray(t) || ARRAY_BUFFER && ArrayBuffer.isView(t))) throw new Error(ERROR);
                h = !0
            }
            for (let e, s, i = 0, o = t.length, a = this.blocks; i < o;) {
                if (this.hashed && (this.hashed = !1, a[0] = this.block, a[16] = a[1] = a[2] = a[3] = a[4] = a[5] = a[6] = a[7] = a[8] = a[9] = a[10] = a[11] = a[12] = a[13] = a[14] = a[15] = 0), h) for (s = this.start; i < o && s < 64; ++i) a[s >> 2] |= t[i] << SHIFT[3 & s++]; else for (s = this.start; i < o && s < 64; ++i) (e = t.charCodeAt(i)) < 128 ? a[s >> 2] |= e << SHIFT[3 & s++] : (e < 2048 ? a[s >> 2] |= (192 | e >> 6) << SHIFT[3 & s++] : (e < 55296 || 57344 <= e ? a[s >> 2] |= (224 | e >> 12) << SHIFT[3 & s++] : (e = 65536 + ((1023 & e) << 10 | 1023 & t.charCodeAt(++i)), a[s >> 2] |= (240 | e >> 18) << SHIFT[3 & s++], a[s >> 2] |= (128 | e >> 12 & 63) << SHIFT[3 & s++]), a[s >> 2] |= (128 | e >> 6 & 63) << SHIFT[3 & s++]), a[s >> 2] |= (128 | 63 & e) << SHIFT[3 & s++]);
                this.lastByteIndex = s, this.bytes += s - this.start, 64 <= s ? (this.block = a[16], this.start = s - 64, this.hash(), this.hashed = !0) : this.start = s
            }
            return 4294967295 < this.bytes && (this.hBytes += this.bytes / 4294967296 << 0, this.bytes = this.bytes % 4294967296), this
        }
    }, Sha256.prototype.finalize = function () {
        if (!this.finalized) {
            this.finalized = !0;
            let t = this.blocks, h = this.lastByteIndex;
            t[16] = this.block, t[h >> 2] |= EXTRA[3 & h], this.block = t[16], 56 <= h && (this.hashed || this.hash(), t[0] = this.block, t[16] = t[1] = t[2] = t[3] = t[4] = t[5] = t[6] = t[7] = t[8] = t[9] = t[10] = t[11] = t[12] = t[13] = t[14] = t[15] = 0), t[14] = this.hBytes << 3 | this.bytes >>> 29, t[15] = this.bytes << 3, this.hash()
        }
    }, Sha256.prototype.hash = function () {
        let t, h, r, e, s, i, o, a, H, n = this.h0, S = this.h1, c = this.h2, f = this.h3, A = this.h4, R = this.h5,
            u = this.h6, _ = this.h7, E = this.blocks;
        for (t = 16; t < 64; ++t) h = ((s = E[t - 15]) >>> 7 | s << 25) ^ (s >>> 18 | s << 14) ^ s >>> 3, r = ((s = E[t - 2]) >>> 17 | s << 15) ^ (s >>> 19 | s << 13) ^ s >>> 10, E[t] = E[t - 16] + h + E[t - 7] + r << 0;
        for (H = S & c, t = 0; t < 64; t += 4) this.first ? (this.is224 ? (i = 300032, _ = (s = E[0] - 1413257819) - 150054599 << 0, f = s + 24177077 << 0) : (i = 704751109, _ = (s = E[0] - 210244248) - 1521486534 << 0, f = s + 143694565 << 0), this.first = !1) : (h = (n >>> 2 | n << 30) ^ (n >>> 13 | n << 19) ^ (n >>> 22 | n << 10), e = (i = n & S) ^ n & c ^ H, _ = f + (s = _ + (r = (A >>> 6 | A << 26) ^ (A >>> 11 | A << 21) ^ (A >>> 25 | A << 7)) + (A & R ^ ~A & u) + K[t] + E[t]) << 0, f = s + (h + e) << 0), h = (f >>> 2 | f << 30) ^ (f >>> 13 | f << 19) ^ (f >>> 22 | f << 10), e = (o = f & n) ^ f & S ^ i, u = c + (s = u + (r = (_ >>> 6 | _ << 26) ^ (_ >>> 11 | _ << 21) ^ (_ >>> 25 | _ << 7)) + (_ & A ^ ~_ & R) + K[t + 1] + E[t + 1]) << 0, h = ((c = s + (h + e) << 0) >>> 2 | c << 30) ^ (c >>> 13 | c << 19) ^ (c >>> 22 | c << 10), e = (a = c & f) ^ c & n ^ o, R = S + (s = R + (r = (u >>> 6 | u << 26) ^ (u >>> 11 | u << 21) ^ (u >>> 25 | u << 7)) + (u & _ ^ ~u & A) + K[t + 2] + E[t + 2]) << 0, h = ((S = s + (h + e) << 0) >>> 2 | S << 30) ^ (S >>> 13 | S << 19) ^ (S >>> 22 | S << 10), e = (H = S & c) ^ S & f ^ a, A = n + (s = A + (r = (R >>> 6 | R << 26) ^ (R >>> 11 | R << 21) ^ (R >>> 25 | R << 7)) + (R & u ^ ~R & _) + K[t + 3] + E[t + 3]) << 0, n = s + (h + e) << 0;
        this.h0 = this.h0 + n << 0, this.h1 = this.h1 + S << 0, this.h2 = this.h2 + c << 0, this.h3 = this.h3 + f << 0, this.h4 = this.h4 + A << 0, this.h5 = this.h5 + R << 0, this.h6 = this.h6 + u << 0, this.h7 = this.h7 + _ << 0
    }, Sha256.prototype.hex = function () {
        this.finalize();
        let t = this.h0, h = this.h1, r = this.h2, e = this.h3, s = this.h4, i = this.h5, o = this.h6, a = this.h7,
            H = HEX_CHARS[t >> 28 & 15] + HEX_CHARS[t >> 24 & 15] + HEX_CHARS[t >> 20 & 15] + HEX_CHARS[t >> 16 & 15] + HEX_CHARS[t >> 12 & 15] + HEX_CHARS[t >> 8 & 15] + HEX_CHARS[t >> 4 & 15] + HEX_CHARS[15 & t] + HEX_CHARS[h >> 28 & 15] + HEX_CHARS[h >> 24 & 15] + HEX_CHARS[h >> 20 & 15] + HEX_CHARS[h >> 16 & 15] + HEX_CHARS[h >> 12 & 15] + HEX_CHARS[h >> 8 & 15] + HEX_CHARS[h >> 4 & 15] + HEX_CHARS[15 & h] + HEX_CHARS[r >> 28 & 15] + HEX_CHARS[r >> 24 & 15] + HEX_CHARS[r >> 20 & 15] + HEX_CHARS[r >> 16 & 15] + HEX_CHARS[r >> 12 & 15] + HEX_CHARS[r >> 8 & 15] + HEX_CHARS[r >> 4 & 15] + HEX_CHARS[15 & r] + HEX_CHARS[e >> 28 & 15] + HEX_CHARS[e >> 24 & 15] + HEX_CHARS[e >> 20 & 15] + HEX_CHARS[e >> 16 & 15] + HEX_CHARS[e >> 12 & 15] + HEX_CHARS[e >> 8 & 15] + HEX_CHARS[e >> 4 & 15] + HEX_CHARS[15 & e] + HEX_CHARS[s >> 28 & 15] + HEX_CHARS[s >> 24 & 15] + HEX_CHARS[s >> 20 & 15] + HEX_CHARS[s >> 16 & 15] + HEX_CHARS[s >> 12 & 15] + HEX_CHARS[s >> 8 & 15] + HEX_CHARS[s >> 4 & 15] + HEX_CHARS[15 & s] + HEX_CHARS[i >> 28 & 15] + HEX_CHARS[i >> 24 & 15] + HEX_CHARS[i >> 20 & 15] + HEX_CHARS[i >> 16 & 15] + HEX_CHARS[i >> 12 & 15] + HEX_CHARS[i >> 8 & 15] + HEX_CHARS[i >> 4 & 15] + HEX_CHARS[15 & i] + HEX_CHARS[o >> 28 & 15] + HEX_CHARS[o >> 24 & 15] + HEX_CHARS[o >> 20 & 15] + HEX_CHARS[o >> 16 & 15] + HEX_CHARS[o >> 12 & 15] + HEX_CHARS[o >> 8 & 15] + HEX_CHARS[o >> 4 & 15] + HEX_CHARS[15 & o];
        return this.is224 || (H += HEX_CHARS[a >> 28 & 15] + HEX_CHARS[a >> 24 & 15] + HEX_CHARS[a >> 20 & 15] + HEX_CHARS[a >> 16 & 15] + HEX_CHARS[a >> 12 & 15] + HEX_CHARS[a >> 8 & 15] + HEX_CHARS[a >> 4 & 15] + HEX_CHARS[15 & a]), H
    }, Sha256.prototype.toString = Sha256.prototype.hex, Sha256.prototype.digest = function () {
        this.finalize();
        let t = this.h0, h = this.h1, r = this.h2, e = this.h3, s = this.h4, i = this.h5, o = this.h6, a = this.h7,
            H = [t >> 24 & 255, t >> 16 & 255, t >> 8 & 255, 255 & t, h >> 24 & 255, h >> 16 & 255, h >> 8 & 255, 255 & h, r >> 24 & 255, r >> 16 & 255, r >> 8 & 255, 255 & r, e >> 24 & 255, e >> 16 & 255, e >> 8 & 255, 255 & e, s >> 24 & 255, s >> 16 & 255, s >> 8 & 255, 255 & s, i >> 24 & 255, i >> 16 & 255, i >> 8 & 255, 255 & i, o >> 24 & 255, o >> 16 & 255, o >> 8 & 255, 255 & o];
        return this.is224 || H.push(a >> 24 & 255, a >> 16 & 255, a >> 8 & 255, 255 & a), H
    }, Sha256.prototype.array = Sha256.prototype.digest, Sha256.prototype.arrayBuffer = function () {
        this.finalize();
        let t = new ArrayBuffer(this.is224 ? 28 : 32), h = new DataView(t);
        return h.setUint32(0, this.h0), h.setUint32(4, this.h1), h.setUint32(8, this.h2), h.setUint32(12, this.h3), h.setUint32(16, this.h4), h.setUint32(20, this.h5), h.setUint32(24, this.h6), this.is224 || h.setUint32(28, this.h7), t
    }, HmacSha256.prototype = new Sha256, HmacSha256.prototype.finalize = function () {
        if (Sha256.prototype.finalize.call(this), this.inner) {
            this.inner = !1;
            let t = this.array();
            Sha256.call(this, this.is224, this.sharedMemory), this.update(this.oKeyPad), this.update(t), Sha256.prototype.finalize.call(this)
        }
    };
    let exports = createMethod();
    exports.sha256 = exports, exports.sha224 = createMethod(!0), exports.sha256.hmac = createHmacMethod(), exports.sha224.hmac = createHmacMethod(!0), COMMON_JS ? module.exports = exports : (root.sha256 = exports.sha256, root.sha224 = exports.sha224, AMD && define(function () {
        return exports
    }))
    sha256js = exports
}();

export default async function http (request) {
    let nonce = ''
    for(let i = 0; i < 6; i++) {
        nonce += Math.floor(Math.random()*10);
    }
    let timestamp = new Date().getTime()
    let SHA256 = sha256js(`appid=webapp&appkey=615c64a2eefc4c9a&data=${JSON.stringify(request.data)}&nonce=${parseInt(nonce)}&timestamp=${timestamp}`)
    let res = await fetch('http://api.evidence.woa.com/1.0/openapi', {
        body: JSON.stringify({
            appid: 'webapp',
            data: JSON.stringify(request.data),
            sign: SHA256,
            timestamp: timestamp,
            nonce: parseInt(nonce),
            msg_no : "MSG123",
        }),
        headers: request.headers ? request.headers : {
            'content-type': 'application/json',
        },
        method: request.method ? request.method : 'GET'
    })
    return res.json()
}
