/* eslint-disable */

export default class QrEncoder {
    /**
     * Library interface
     * @param {QrEncoderConfig} config
     */
    static render(config) {
        return this._qrCodeGenerator(config);
    }

    /**
     * Register the plugin
     * @param {QrEncoderConfig} options
     */
    static _qrCodeGenerator(options) {
        /** @type {QrEncoderSettings} */
        const settings = ({});
        Object.assign(settings, this.defaults, options);
        return this._createCanvas(settings);
    }

    /*! jquery-qrcode v0.14.0 - https://larsjung.de/jquery-qrcode/ */

    // Wrapper for the original QR code generator.
    /**
     * @param {string} text
     * @param {string} level
     * @param {number} version
     * @param {number} quiet
     */
    static _createQRCode(text, level, version, quiet) {
        const qr = {};

        const vqr = this.vendor_qrcode(version, level);
        vqr.addData(text);
        vqr.make();

        quiet = quiet || 0;

        const qrModuleCount = vqr.getModuleCount();
        const quietModuleCount = vqr.getModuleCount() + 2 * quiet;

        /**
         * @param {number} row
         * @param {number} col
         */
        function isDark(row, col) {
            row -= quiet;
            col -= quiet;

            if (row < 0 || row >= qrModuleCount || col < 0 || col >= qrModuleCount) {
                return false;
            }
            return vqr.isDark(row, col);
        }

        qr.text = text;
        qr.level = level;
        qr.version = version;
        qr.moduleCount = quietModuleCount;
        qr.isDark = isDark;
        //        qr.addBlank = addBlank;

        return qr;
    }

    // Returns a minimal QR code for the given text starting with version `minVersion`.
    // Returns `undefined` if `text` is too long to be encoded in `maxVersion`.
    /**
     * @param {string} text
     * @param {string} level
     * @param {number} minVersion
     * @param {number} maxVersion
     * @param {number} quiet
     */
    static _createMinQRCode(text, level, minVersion, maxVersion, quiet) {
        minVersion = Math.max(1, minVersion || 1);
        maxVersion = Math.min(40, maxVersion || 40);
        for (let version = minVersion; version <= maxVersion; version += 1) {
            try {
                return this._createQRCode(text, level, version, quiet);
            } catch (err) { } // eslint-disable-line no-empty
        }
        return undefined;
    }

    /**
     * @param {any} qr
     * @param {CanvasRenderingContext2D} context
     * @param {QrEncoderSettings} settings
     */
    static _drawBackground(qr, context, settings) {
        if (settings.background) {
            context.fillStyle = settings.background;
            context.fillRect(settings.left, settings.top, settings.size, settings.size);
        }
    }

    // used when center is filled
    /**
     * @param {CanvasRenderingContext2D} ctx
     * @param {number} l
     * @param {number} t
     * @param {number} r
     * @param {number} b
     * @param {number} rad
     * @param {boolean} nw
     * @param {boolean} ne
     * @param {boolean} se
     * @param {boolean} sw
     */
    static _drawModuleRoundedDark(ctx, l, t, r, b, rad, nw, ne, se, sw) {
        // let moveTo = (x, y) => ctx.moveTo(Math.floor(x), Math.floor(y));
        if (nw) {
            ctx.moveTo(l + rad, t);
        } else {
            ctx.moveTo(l, t);
        }

        /**
         * @param {boolean} b_
         * @param {number} x0
         * @param {number} y0
         * @param {number} x1
         * @param {number} y1
         * @param {number} r0
         * @param {number} r1
         */
        function lal(b_, x0, y0, x1, y1, r0, r1) {
            if (b_) {
                ctx.lineTo(x0 + r0, y0 + r1);
                ctx.arcTo(x0, y0, x1, y1, rad);
            } else {
                ctx.lineTo(x0, y0);
            }
        }

        lal(ne, r, t, r, b, -rad, 0);
        lal(se, r, b, l, b, 0, -rad);
        lal(sw, l, b, l, t, rad, 0);
        lal(nw, l, t, r, t, 0, rad);
    }

    // used when center is empty
    /**
     * @param {CanvasRenderingContext2D} ctx
     * @param {number} l
     * @param {number} t
     * @param {number} r
     * @param {number} b
     * @param {number} rad
     * @param {boolean} nw
     * @param {boolean} ne
     * @param {boolean} se
     * @param {boolean} sw
     */
    static _drawModuleRoundendLight(ctx, l, t, r, b, rad, nw, ne, se, sw) {
        /**
         * @param {number} x
         * @param {number} y
         * @param {number} r0
         * @param {number} r1
         */
        function mlla(x, y, r0, r1) {
            ctx.moveTo(x + r0, y);
            ctx.lineTo(x, y);
            ctx.lineTo(x, y + r1);
            ctx.arcTo(x, y, x + r0, y, rad);
        }

        if (nw) mlla(l, t, rad, rad);
        if (ne) mlla(r, t, -rad, rad);
        if (se) mlla(r, b, -rad, -rad);
        if (sw) mlla(l, b, rad, -rad);
    }

    /**
     * @param {any} qr
     * @param {CanvasRenderingContext2D} context
     * @param {QrEncoderSettings} settings
     * @param {number} left
     * @param {number} top
     * @param {number} width
     * @param {number} row
     * @param {number} col
     */
    static _drawModuleRounded(qr, context, settings, left, top, width, row, col) {
        const isDark = qr.isDark;
        const right = left + width;
        const bottom = top + width;
        const rowT = row - 1;
        const rowB = row + 1;
        const colL = col - 1;
        const colR = col + 1;
        const radius = Math.floor(Math.max(0.5, settings.radius) * width);
        const center = isDark(row, col);
        const northwest = isDark(rowT, colL);
        const north = isDark(rowT, col);
        const northeast = isDark(rowT, colR);
        const east = isDark(row, colR);
        const southeast = isDark(rowB, colR);
        const south = isDark(rowB, col);
        const southwest = isDark(rowB, colL);
        const west = isDark(row, colL);

        if (center) {
            this._drawModuleRoundedDark(context, left, top, right, bottom, radius, !north && !west, !north && !east, !south && !east, !south && !west);
        } else {
            this._drawModuleRoundendLight(context, left, top, right, bottom, radius, north && west && northwest, north && east && northeast, south && east && southeast, south && west && southwest);
        }
    }

    /**
     * @param {any} qr
     * @param {CanvasRenderingContext2D} context
     * @param {QrEncoderSettings} settings
     */
    static _drawModules(qr, context, settings) {
        const moduleCount = qr.moduleCount;
        const moduleSize = settings.size / moduleCount;
        let row;
        let col;

        context.beginPath();
        for (row = 0; row < moduleCount; row += 1) {
            for (col = 0; col < moduleCount; col += 1) {
                const l = settings.left + col * moduleSize;
                const t = settings.top + row * moduleSize;
                const w = moduleSize;

                this._drawModuleRounded(qr, context, settings, l, t, w, row, col);
            }
        }

        context.fillStyle = settings.fill;
        context.fill();
    }

    // Draws QR code to the given `canvas` and returns it.
    /**
     * @param {HTMLCanvasElement} canvas
     * @param {QrEncoderSettings} settings
     */
    static _drawOnCanvas(canvas, settings) {
        const qr = this._createMinQRCode(settings.text, settings.ecLevel, settings.minVersion, settings.maxVersion, settings.quiet);
        if (!qr) {
            return null;
        }

        /** @type {CanvasRenderingContext2D} */
        const context = (canvas.getContext('2d'));

        this._drawBackground(qr, context, settings);
        this._drawModules(qr, context, settings);

        return canvas;
    }

    // Returns a `canvas` element representing the QR code for the given settings.
    /**
     * @param {QrEncoderSettings} settings
     */
    static _createCanvas(settings) {
        const $canvas = document.createElement('canvas');
        $canvas.width = settings.size;
        $canvas.height = settings.size;
        return this._drawOnCanvas($canvas, settings);
    }
}

// Plugin
// ======

// Default settings
// ----------------
/**
 * @typedef {{minVersion?: number, maxVersion?: number, ecLevel?: string, left?: number, top?: number, size?: number, fill?: string, background?: string|null, text?: string, radius?: number, quiet?: number}} QrEncoderConfig
 * @typedef {{minVersion: number, maxVersion: number, ecLevel: string, left: number, top: number, size: number, fill: string, background: string|null, text: string, radius: number, quiet: number}} QrEncoderSettings
 */
QrEncoder.defaults = {
    // version range somewhere in 1 .. 40
    minVersion: 1,
    maxVersion: 40,

    // error correction level: `'L'`, `'M'`, `'Q'` or `'H'`
    ecLevel: 'L',

    // offset in pixel if drawn onto existing canvas
    left: 0,
    top: 0,

    // size in pixel
    size: 200,

    // code color or image element
    fill: '#000',

    // background color, `null` for transparent background
    /** @type {string|null} */
    background: null,

    // content
    text: 'no text',

    // corner radius relative to module width: 0.0 .. 0.5
    radius: 0.5,

    // quiet zone in modules
    quiet: 0,

};

QrEncoder.vendor_qrcode = (function () {
    // `qrcode` is the single public function defined by the `QR Code Generator`
    //---------------------------------------------------------------------
    //
    // QR Code Generator for JavaScript
    //
    // Copyright (c) 2009 Kazuhiko Arase
    //
    // URL: http://www.d-project.com/
    //
    // Licensed under the MIT license:
    //  http://www.opensource.org/licenses/mit-license.php
    //
    // The word 'QR Code' is registered trademark of
    // DENSO WAVE INCORPORATED
    //  http://www.denso-wave.com/qrcode/faqpatent-e.html
    //
    //---------------------------------------------------------------------

    const qrcode = (function () {
        //---------------------------------------------------------------------
        // qrcode
        //---------------------------------------------------------------------

        /**
         * @typedef {{addData(data: string): void, isDark(row: number, col: number): boolean|null, getModuleCount(): number, make(): void}} QrCode
         * @param {number} typeNumber 1 to 40
         * @param {string} errorCorrectLevel 'L','M','Q','H'
         */
        const qrcode = function (typeNumber, errorCorrectLevel) { // eslint-disable-line no-shadow
            const PAD0 = 0xEC;
            const PAD1 = 0x11;
            const _typeNumber = typeNumber;
            const _errorCorrectLevel = QRErrorCorrectLevel[errorCorrectLevel];
            let _modules = /** @type {(boolean|null)[][]|null} */ (null);
            let _moduleCount = 0;
            let _dataCache = /** @type {any} */ (null);
            const _dataList = /** @type {any} */ ([]);
            /** @type {QrCode} */
            const _this = {};
            /** @param {boolean} test @param {number} maskPattern */
            const makeImpl = function (test, maskPattern) {
                _moduleCount = _typeNumber * 4 + 17;
                _modules = (function (moduleCount) {
                    /** @type {(boolean|null)[][]} */
                    const modules = new Array(moduleCount);
                    for (let row = 0; row < moduleCount; row += 1) {
                        modules[row] = new Array(moduleCount);
                        for (let col = 0; col < moduleCount; col += 1) {
                            modules[row][col] = null;
                        }
                    }
                    return modules;
                }(_moduleCount));

                setupPositionProbePattern(0, 0);
                setupPositionProbePattern(_moduleCount - 7, 0);
                setupPositionProbePattern(0, _moduleCount - 7);
                setupPositionAdjustPattern();
                setupTimingPattern();
                setupTypeInfo(test, maskPattern);

                if (_typeNumber >= 7) {
                    setupTypeNumber(test);
                }

                if (_dataCache == null) {
                    _dataCache = createData(_typeNumber, _errorCorrectLevel, _dataList);
                }

                mapData(_dataCache, maskPattern);
            };
            /** @param {number} row @param {number} col */
            var setupPositionProbePattern = function (row, col) {
                for (let r = -1; r <= 7; r += 1) {
                    if (row + r <= -1 || _moduleCount <= row + r) continue;

                    for (let c = -1; c <= 7; c += 1) {
                        if (col + c <= -1 || _moduleCount <= col + c) continue;

                        if ((r >= 0 && r <= 6 && (c == 0 || c == 6))
                            || (c >= 0 && c <= 6 && (r == 0 || r == 6))
                            || (r >= 2 && r <= 4 && c >= 2 && c <= 4)) {
                            /** @type {(boolean|null)[][]} */ (_modules)[row + r][col + c] = true;
                        } else {
                            /** @type {(boolean|null)[][]} */ (_modules)[row + r][col + c] = false;
                        }
                    }
                }
            };
            /** @returns {number} */
            const getBestMaskPattern = function () {
                let minLostPoint = 0;
                let pattern = 0;

                for (let i = 0; i < 8; i += 1) {
                    makeImpl(true, i);

                    const lostPoint = QRUtil.getLostPoint(_this);

                    if (i == 0 || minLostPoint > lostPoint) {
                        minLostPoint = lostPoint;
                        pattern = i;
                    }
                }

                return pattern;
            };
            /** */
            var setupTimingPattern = function () {
                for (let r = 8; r < _moduleCount - 8; r += 1) {
                    if (/** @type {(boolean|null)[][]} */ (_modules)[r][6] != null) {
                        continue;
                    }
                    (/** @type {(boolean|null)[][]} */ (_modules))[r][6] = (r % 2 == 0);
                }

                for (let c = 8; c < _moduleCount - 8; c += 1) {
                    if (/** @type {(boolean|null)[][]} */ (_modules)[6][c] != null) {
                        continue;
                    }
                    (/** @type {(boolean|null)[][]} */ (_modules))[6][c] = (c % 2 == 0);
                }
            };
            /** */
            var setupPositionAdjustPattern = function () {
                const pos = QRUtil.getPatternPosition(_typeNumber);

                for (let i = 0; i < pos.length; i += 1) {
                    for (let j = 0; j < pos.length; j += 1) {
                        const row = pos[i];
                        const col = pos[j];

                        if (/** @type {(boolean|null)[][]} */ (_modules)[row][col] != null) {
                            continue;
                        }

                        for (let r = -2; r <= 2; r += 1) {
                            for (let c = -2; c <= 2; c += 1) {
                                /** @type {(boolean|null)[][]} */
                                (_modules)[row + r][col + c] = r == -2 || r == 2 || c == -2 || c == 2 || (r == 0 && c == 0);
                            }
                        }
                    }
                }
            };
            // TODO rm5 can be removed if we fix type to 5 (this method is called at 7 only)
            /** @param {boolean} test */
            var setupTypeNumber = function (test) {
                const bits = QRUtil.getBCHTypeNumber(_typeNumber);

                for (var i = 0; i < 18; i += 1) {
                    var mod = (!test && ((bits >> i) & 1) == 1);
                    /** @type {(boolean|null)[][]} */
                    (_modules)[Math.floor(i / 3)][i % 3 + _moduleCount - 8 - 3] = mod;
                }

                for (var i = 0; i < 18; i += 1) {
                    var mod = (!test && ((bits >> i) & 1) == 1);
                    /** @type {(boolean|null)[][]} */
                    (_modules)[i % 3 + _moduleCount - 8 - 3][Math.floor(i / 3)] = mod;
                }
            };
            /** @param {boolean} test @param {number} maskPattern */
            var setupTypeInfo = function (test, maskPattern) {
                const data = (_errorCorrectLevel << 3) | maskPattern;
                const bits = QRUtil.getBCHTypeInfo(data);

                for (let i = 0; i < 15; i += 1) {
                    const mod = (!test && ((bits >> i) & 1) == 1);

                    // vertical then horizontal
                    /** @type {(boolean|null)[][]} */
                    (_modules)[i < 6 ? i : (i < 8 ? i + 1 : _moduleCount - 15 + i)][8] = mod;
                    /** @type {(boolean|null)[][]} */
                    (_modules)[8][i < 8 ? _moduleCount - i - 1 : (i < 9 ? 15 - i : 14 - i)] = mod;
                }

                // fixed module
                (/** @type {(boolean|null)[][]} */ (_modules))[_moduleCount - 8][8] = (!test);
            };
            /** @param {number[]} data @param {number} maskPattern */
            var mapData = function (data, maskPattern) {
                let inc = -1;
                let row = _moduleCount - 1;
                let bitIndex = 7;
                let byteIndex = 0;
                const maskFunc = QRUtil.getMaskFunction(maskPattern);

                for (let col = _moduleCount - 1; col > 0; col -= 2) {
                    if (col == 6) col -= 1;

                    while (true) { // eslint-disable-line no-constant-condition
                        for (let c = 0; c < 2; c += 1) {
                            if (/** @type {(boolean|null)[][]} */ (_modules)[row][col - c] == null) {
                                let dark = false;

                                if (byteIndex < data.length) {
                                    dark = (((data[byteIndex] >>> bitIndex) & 1) == 1);
                                }

                                const mask = maskFunc(row, col - c);

                                if (mask) {
                                    dark = !dark;
                                }

                                /** @type {(boolean|null)[][]} */ (_modules)[row][col - c] = dark;
                                bitIndex -= 1;

                                if (bitIndex == -1) {
                                    byteIndex += 1;
                                    bitIndex = 7;
                                }
                            }
                        }

                        row += inc;

                        if (row < 0 || _moduleCount <= row) {
                            row -= inc;
                            inc = -inc;
                            break;
                        }
                    }
                }
            };
            /** @param {QrBitBuffer} buffer @param {any[]} rsBlocks */
            const createBytes = function (buffer, rsBlocks) {
                let offset = 0;
                let maxDcCount = 0;
                let maxEcCount = 0;
                const dcdata = new Array(rsBlocks.length);
                const ecdata = new Array(rsBlocks.length);

                for (var r = 0; r < rsBlocks.length; r += 1) {
                    const dcCount = rsBlocks[r].dataCount;
                    const ecCount = rsBlocks[r].totalCount - dcCount;

                    maxDcCount = Math.max(maxDcCount, dcCount);
                    maxEcCount = Math.max(maxEcCount, ecCount);

                    dcdata[r] = new Array(dcCount);

                    for (var i = 0; i < dcdata[r].length; i += 1) {
                        dcdata[r][i] = 0xff & buffer.getBuffer()[i + offset];
                    }
                    offset += dcCount;

                    const rsPoly = QRUtil.getErrorCorrectPolynomial(ecCount);
                    const rawPoly = qrPolynomial(dcdata[r], rsPoly.getLength() - 1);
                    const modPoly = rawPoly.mod(rsPoly);

                    ecdata[r] = new Array(rsPoly.getLength() - 1);
                    for (var i = 0; i < ecdata[r].length; i += 1) {
                        const modIndex = i + modPoly.getLength() - ecdata[r].length;
                        ecdata[r][i] = (modIndex >= 0) ? modPoly.getAt(modIndex) : 0;
                    }
                }

                let totalCodeCount = 0;
                for (var i = 0; i < rsBlocks.length; i += 1) {
                    totalCodeCount += rsBlocks[i].totalCount;
                }

                const data = new Array(totalCodeCount);
                let index = 0;

                for (var i = 0; i < maxDcCount; i += 1) {
                    for (var r = 0; r < rsBlocks.length; r += 1) {
                        if (i < dcdata[r].length) {
                            data[index] = dcdata[r][i];
                            index += 1;
                        }
                    }
                }

                for (var i = 0; i < maxEcCount; i += 1) {
                    for (var r = 0; r < rsBlocks.length; r += 1) {
                        if (i < ecdata[r].length) {
                            data[index] = ecdata[r][i];
                            index += 1;
                        }
                    }
                }

                return data;
            };
            /** @param {number} typeNumber_ @param {number} errorCorrectLevel_ @param {any} dataList */
            var createData = function (typeNumber_, errorCorrectLevel_, dataList) {
                const rsBlocks = QRRSBlock.getRSBlocks(typeNumber_, errorCorrectLevel_);
                const buffer = qrBitBuffer();

                for (var i = 0; i < dataList.length; i += 1) {
                    const data = dataList[i];
                    buffer.put(data.getMode(), 4);
                    buffer.put(data.getLength(), QRUtil.getLengthInBits(data.getMode(), typeNumber_));
                    data.write(buffer);
                }

                // calc num max data.
                let totalDataCount = 0;
                for (var i = 0; i < rsBlocks.length; i += 1) {
                    totalDataCount += rsBlocks[i].dataCount;
                }

                if (buffer.getLengthInBits() > totalDataCount * 8) {
                    throw new Error(`code length overflow. (${
                        buffer.getLengthInBits()
                    }>${
                        totalDataCount * 8
                    })`);
                }

                // end code
                if (buffer.getLengthInBits() + 4 <= totalDataCount * 8) {
                    buffer.put(0, 4);
                }

                // padding
                while (buffer.getLengthInBits() % 8 != 0) {
                    buffer.putBit(false);
                }

                // padding
                while (true) { // eslint-disable-line no-constant-condition
                    if (buffer.getLengthInBits() >= totalDataCount * 8) {
                        break;
                    }
                    buffer.put(PAD0, 8);

                    if (buffer.getLengthInBits() >= totalDataCount * 8) {
                        break;
                    }
                    buffer.put(PAD1, 8);
                }

                return createBytes(buffer, rsBlocks);
            };

            /**
             * @param {string} data
             */
            _this.addData = function (data) {
                const newData = qr8BitByte(data);
                _dataList.push(newData);
                _dataCache = null;
            };

            /**
             * @param {number} row
             * @param {number} col
             */
            _this.isDark = function (row, col) {
                if (row < 0 || _moduleCount <= row || col < 0 || _moduleCount <= col) {
                    throw new Error(`${row},${col}`);
                }
                return /** @type {(boolean|null)[][]} */ (_modules)[row][col];
            };

            _this.getModuleCount = function () {
                return _moduleCount;
            };

            _this.make = function () {
                makeImpl(false, getBestMaskPattern());
            };

            return _this;
        };

        //---------------------------------------------------------------------
        // qrcode.stringToBytes
        //---------------------------------------------------------------------

        // UTF-8 version
        /**
         * @param {string} s
         */
        qrcode.stringToBytes = function (s) {
            // http://stackoverflow.com/questions/18729405/how-to-convert-utf8-string-to-byte-array
            /**
             * @param {string} str
             */
            function toUTF8Array(str) {
                const utf8 = [];
                for (let i = 0; i < str.length; i++) {
                    let charcode = str.charCodeAt(i);
                    if (charcode < 0x80) utf8.push(charcode);
                    else if (charcode < 0x800) {
                        utf8.push(0xc0 | (charcode >> 6),
                            0x80 | (charcode & 0x3f));
                    } else if (charcode < 0xd800 || charcode >= 0xe000) {
                        utf8.push(0xe0 | (charcode >> 12),
                            0x80 | ((charcode >> 6) & 0x3f),
                            0x80 | (charcode & 0x3f));
                    } else { // surrogate pair
                        i += 1;
                        // UTF-16 encodes 0x10000-0x10FFFF by
                        // subtracting 0x10000 and splitting the
                        // 20 bits of 0x0-0xFFFFF into two halves
                        charcode = 0x10000 + (((charcode & 0x3ff) << 10)
                            | (str.charCodeAt(i) & 0x3ff));
                        utf8.push(0xf0 | (charcode >> 18),
                            0x80 | ((charcode >> 12) & 0x3f),
                            0x80 | ((charcode >> 6) & 0x3f),
                            0x80 | (charcode & 0x3f));
                    }
                }
                return utf8;
            }
            return toUTF8Array(s);
        };

        //---------------------------------------------------------------------
        // QRMode
        //---------------------------------------------------------------------

        const QRMode = {
            MODE_8BIT_BYTE: 1 << 2,
        };

        //---------------------------------------------------------------------
        // QRErrorCorrectLevel
        //---------------------------------------------------------------------

        /** @type {{[level: string]: number}} */
        var QRErrorCorrectLevel = {
            L: 1,
            M: 0,
            Q: 3,
            H: 2,
        };

        //---------------------------------------------------------------------
        // QRMaskPattern
        //---------------------------------------------------------------------

        /** @type {{[pattern: string]: number}} */
        const QRMaskPattern = {
            PATTERN000: 0,
            PATTERN001: 1,
            PATTERN010: 2,
            PATTERN011: 3,
            PATTERN100: 4,
            PATTERN101: 5,
            PATTERN110: 6,
            PATTERN111: 7,
        };

        //---------------------------------------------------------------------
        // QRUtil
        //---------------------------------------------------------------------

        var QRUtil = (function () {
            const PATTERN_POSITION_TABLE = [
                [],
                [6, 18],
                [6, 22],
                [6, 26],
                [6, 30],
                [6, 34],
                [6, 22, 38],
                [6, 24, 42],
                [6, 26, 46],
                [6, 28, 50],
                [6, 30, 54],
                [6, 32, 58],
                [6, 34, 62],
                [6, 26, 46, 66],
                [6, 26, 48, 70],
                [6, 26, 50, 74],
                [6, 30, 54, 78],
                [6, 30, 56, 82],
                [6, 30, 58, 86],
                [6, 34, 62, 90],
                [6, 28, 50, 72, 94],
                [6, 26, 50, 74, 98],
                [6, 30, 54, 78, 102],
                [6, 28, 54, 80, 106],
                [6, 32, 58, 84, 110],
                [6, 30, 58, 86, 114],
                [6, 34, 62, 90, 118],
                [6, 26, 50, 74, 98, 122],
                [6, 30, 54, 78, 102, 126],
                [6, 26, 52, 78, 104, 130],
                [6, 30, 56, 82, 108, 134],
                [6, 34, 60, 86, 112, 138],
                [6, 30, 58, 86, 114, 142],
                [6, 34, 62, 90, 118, 146],
                [6, 30, 54, 78, 102, 126, 150],
                [6, 24, 50, 76, 102, 128, 154],
                [6, 28, 54, 80, 106, 132, 158],
                [6, 32, 58, 84, 110, 136, 162],
                [6, 26, 54, 82, 110, 138, 166],
                [6, 30, 58, 86, 114, 142, 170],
            ];
            const G15 = (1 << 10) | (1 << 8) | (1 << 5) | (1 << 4) | (1 << 2) | (1 << 1) | (1 << 0);
            const G18 = (1 << 12) | (1 << 11) | (1 << 10) | (1 << 9) | (1 << 8) | (1 << 5) | (1 << 2) | (1 << 0);
            const G15_MASK = (1 << 14) | (1 << 12) | (1 << 10) | (1 << 4) | (1 << 1);
            const _this = {};
            /** @param {number} data */
            const getBCHDigit = function (data) {
                let digit = 0;
                while (data != 0) {
                    digit += 1;
                    data >>>= 1;
                }
                return digit;
            };

            _this.getBCHTypeInfo = /** @param {number} data */ function (data) {
                let d = data << 10;
                while (getBCHDigit(d) - getBCHDigit(G15) >= 0) {
                    d ^= (G15 << (getBCHDigit(d) - getBCHDigit(G15)));
                }
                return ((data << 10) | d) ^ G15_MASK;
            };

            // TODO rm5 (see rm5 above)
            _this.getBCHTypeNumber = /** @param {number} data */ function (data) {
                let d = data << 12;
                while (getBCHDigit(d) - getBCHDigit(G18) >= 0) {
                    d ^= (G18 << (getBCHDigit(d) - getBCHDigit(G18)));
                }
                return (data << 12) | d;
            };

            _this.getPatternPosition = /** @param {number} typeNumber */ function (typeNumber) {
                return PATTERN_POSITION_TABLE[typeNumber - 1];
            };

            _this.getMaskFunction = /** @param {number} maskPattern */ function (maskPattern) {
                switch (maskPattern) {
                    case QRMaskPattern.PATTERN000:
                        return /** @param {number} i @param {number} j */ function (i, j) { return (i + j) % 2 == 0; };
                    case QRMaskPattern.PATTERN001:
                        return /** @param {number} i @param {number} j */ function (i, j) { return i % 2 == 0; }; // eslint-disable-line no-unused-vars
                    case QRMaskPattern.PATTERN010:
                        return /** @param {number} i @param {number} j */ function (i, j) { return j % 3 == 0; };
                    case QRMaskPattern.PATTERN011:
                        return /** @param {number} i @param {number} j */ function (i, j) { return (i + j) % 3 == 0; };
                    case QRMaskPattern.PATTERN100:
                        return /** @param {number} i @param {number} j */ function (i, j) { return (Math.floor(i / 2) + Math.floor(j / 3)) % 2 == 0; };
                    case QRMaskPattern.PATTERN101:
                        return /** @param {number} i @param {number} j */ function (i, j) { return (i * j) % 2 + (i * j) % 3 == 0; };
                    case QRMaskPattern.PATTERN110:
                        return /** @param {number} i @param {number} j */ function (i, j) { return ((i * j) % 2 + (i * j) % 3) % 2 == 0; };
                    case QRMaskPattern.PATTERN111:
                        return /** @param {number} i @param {number} j */ function (i, j) { return ((i * j) % 3 + (i + j) % 2) % 2 == 0; };

                    default:
                        throw new Error(`bad maskPattern:${maskPattern}`);
                }
            };

            /**
             * @param {number} errorCorrectLength
             */
            _this.getErrorCorrectPolynomial = function (errorCorrectLength) {
                let a = qrPolynomial([1], 0);
                for (let i = 0; i < errorCorrectLength; i += 1) {
                    a = a.multiply(qrPolynomial([1, QRMath.gexp(i)], 0));
                }
                return a;
            };

            /**
             * @param {number} mode
             * @param {number} type
             */
            _this.getLengthInBits = function (mode, type) {
                if (mode != QRMode.MODE_8BIT_BYTE || type < 1 || type > 40) throw new Error(`mode: ${mode}; type: ${type}`);

                return type < 10 ? 8 : 16;
            };

            /**
             * @param {QrCode} qrcode
             */
            _this.getLostPoint = function (qrcode) { // eslint-disable-line no-shadow
                const moduleCount = qrcode.getModuleCount();
                let lostPoint = 0;

                // LEVEL1
                for (var row = 0; row < moduleCount; row += 1) {
                    for (var col = 0; col < moduleCount; col += 1) {
                        let sameCount = 0;
                        const dark = qrcode.isDark(row, col);

                        for (let r = -1; r <= 1; r += 1) {
                            if (row + r < 0 || moduleCount <= row + r) {
                                continue;
                            }

                            for (let c = -1; c <= 1; c += 1) {
                                if (col + c < 0 || moduleCount <= col + c) {
                                    continue;
                                }

                                if (r == 0 && c == 0) {
                                    continue;
                                }

                                if (dark == qrcode.isDark(row + r, col + c)) {
                                    sameCount += 1;
                                }
                            }
                        }

                        if (sameCount > 5) {
                            lostPoint += (3 + sameCount - 5);
                        }
                    }
                }

                // LEVEL2
                for (var row = 0; row < moduleCount - 1; row += 1) {
                    for (var col = 0; col < moduleCount - 1; col += 1) {
                        let count = 0;
                        if (qrcode.isDark(row, col)) count += 1;
                        if (qrcode.isDark(row + 1, col)) count += 1;
                        if (qrcode.isDark(row, col + 1)) count += 1;
                        if (qrcode.isDark(row + 1, col + 1)) count += 1;
                        if (count == 0 || count == 4) {
                            lostPoint += 3;
                        }
                    }
                }

                // LEVEL3
                for (var row = 0; row < moduleCount; row += 1) {
                    for (var col = 0; col < moduleCount - 6; col += 1) {
                        if (qrcode.isDark(row, col)
                            && !qrcode.isDark(row, col + 1)
                            && qrcode.isDark(row, col + 2)
                            && qrcode.isDark(row, col + 3)
                            && qrcode.isDark(row, col + 4)
                            && !qrcode.isDark(row, col + 5)
                            && qrcode.isDark(row, col + 6)) {
                            lostPoint += 40;
                        }
                    }
                }
                for (var col = 0; col < moduleCount; col += 1) {
                    for (var row = 0; row < moduleCount - 6; row += 1) {
                        if (qrcode.isDark(row, col)
                            && !qrcode.isDark(row + 1, col)
                            && qrcode.isDark(row + 2, col)
                            && qrcode.isDark(row + 3, col)
                            && qrcode.isDark(row + 4, col)
                            && !qrcode.isDark(row + 5, col)
                            && qrcode.isDark(row + 6, col)) {
                            lostPoint += 40;
                        }
                    }
                }

                // LEVEL4
                let darkCount = 0;
                for (var col = 0; col < moduleCount; col += 1) {
                    for (var row = 0; row < moduleCount; row += 1) {
                        if (qrcode.isDark(row, col)) {
                            darkCount += 1;
                        }
                    }
                }

                const ratio = Math.abs(100 * darkCount / moduleCount / moduleCount - 50) / 5;
                lostPoint += ratio * 10;

                return lostPoint;
            };

            return _this;
        }());

        //---------------------------------------------------------------------
        // QRMath
        //---------------------------------------------------------------------

        var QRMath = (function () {
            const EXP_TABLE = /** @type {number[]} */ (new Array(256));
            const LOG_TABLE = /** @type {number[]} */ (new Array(256));

            // initialize tables
            for (var i = 0; i < 8; i += 1) {
                EXP_TABLE[i] = 1 << i;
            }
            for (var i = 8; i < 256; i += 1) {
                EXP_TABLE[i] = EXP_TABLE[i - 4]
                    ^ EXP_TABLE[i - 5]
                    ^ EXP_TABLE[i - 6]
                    ^ EXP_TABLE[i - 8];
            }
            for (var i = 0; i < 255; i += 1) {
                LOG_TABLE[EXP_TABLE[i]] = i;
            }

            const _this = {};

            /** @param {number} n */
            _this.glog = function (n) {
                if (n < 1) {
                    throw new Error(`glog(${n})`);
                }

                return LOG_TABLE[n];
            };

            /** @param {number} n */
            _this.gexp = function (n) {
                while (n < 0) {
                    n += 255;
                }

                while (n >= 256) {
                    n -= 255;
                }

                return EXP_TABLE[n];
            };

            return _this;
        }());

        //---------------------------------------------------------------------
        // qrPolynomial
        //---------------------------------------------------------------------

        /**
         * @typedef {{getAt(index: number): number, getLength(): number, multiply(e: QrPolynomial): QrPolynomial, mod(e: QrPolynomial): QrPolynomial}} QrPolynomial
         * @param {number[]} num
         * @param {number} shift
         * @returns {QrPolynomial}
         */
        function qrPolynomial(num, shift) {
            if (typeof num.length === 'undefined') {
                throw new Error(`${num.length}/${shift}`);
            }

            /** @type {number[]} */
            const _num = (function () {
                let offset = 0;
                while (offset < num.length && num[offset] == 0) {
                    offset += 1;
                }
                /** @type {number[]} */
                const _num_ = new Array(num.length - offset + shift);
                for (let i = 0; i < num.length - offset; i += 1) {
                    _num_[i] = num[i + offset];
                }
                return _num_;
            }());

            const _this = {};

            /** @param {number} index */
            _this.getAt = function (index) {
                return _num[index];
            };

            _this.getLength = function () {
                return _num.length;
            };

            /**
             * @param {QrPolynomial} e
             * @returns {QrPolynomial}
             */
            _this.multiply = function (e) {
                const num_ = new Array(_this.getLength() + e.getLength() - 1);

                for (let i = 0; i < _this.getLength(); i += 1) {
                    for (let j = 0; j < e.getLength(); j += 1) {
                        num_[i + j] ^= QRMath.gexp(QRMath.glog(_this.getAt(i)) + QRMath.glog(e.getAt(j)));
                    }
                }

                return qrPolynomial(num_, 0);
            };

            /**
             * @param {QrPolynomial} e
             * @returns {QrPolynomial}
             */
            _this.mod = function (e) {
                if (_this.getLength() - e.getLength() < 0) {
                    return _this;
                }

                const ratio = QRMath.glog(_this.getAt(0)) - QRMath.glog(e.getAt(0));

                const num_ = new Array(_this.getLength());
                for (var i = 0; i < _this.getLength(); i += 1) {
                    num_[i] = _this.getAt(i);
                }

                for (var i = 0; i < e.getLength(); i += 1) {
                    num_[i] ^= QRMath.gexp(QRMath.glog(e.getAt(i)) + ratio);
                }

                // recursive call
                return qrPolynomial(num_, 0).mod(e);
            };

            return _this;
        }

        //---------------------------------------------------------------------
        // QRRSBlock
        //---------------------------------------------------------------------

        var QRRSBlock = (function () {
            // TODO is it possible to generate this block with JS in less kB?
            const RS_BLOCK_TABLE = [

                // L
                // M
                // Q
                // H

                // 1
                [1, 26, 19],
                [1, 26, 16],
                [1, 26, 13],
                [1, 26, 9],

                // 2
                [1, 44, 34],
                [1, 44, 28],
                [1, 44, 22],
                [1, 44, 16],

                // 3
                [1, 70, 55],
                [1, 70, 44],
                [2, 35, 17],
                [2, 35, 13],

                // 4
                [1, 100, 80],
                [2, 50, 32],
                [2, 50, 24],
                [4, 25, 9],

                // 5
                [1, 134, 108],
                [2, 67, 43],
                [2, 33, 15, 2, 34, 16],
                [2, 33, 11, 2, 34, 12],

                // 6
                [2, 86, 68],
                [4, 43, 27],
                [4, 43, 19],
                [4, 43, 15],

                // 7
                [2, 98, 78],
                [4, 49, 31],
                [2, 32, 14, 4, 33, 15],
                [4, 39, 13, 1, 40, 14],

                // 8
                [2, 121, 97],
                [2, 60, 38, 2, 61, 39],
                [4, 40, 18, 2, 41, 19],
                [4, 40, 14, 2, 41, 15],

                // 9
                [2, 146, 116],
                [3, 58, 36, 2, 59, 37],
                [4, 36, 16, 4, 37, 17],
                [4, 36, 12, 4, 37, 13],

                // 10
                [2, 86, 68, 2, 87, 69],
                [4, 69, 43, 1, 70, 44],
                [6, 43, 19, 2, 44, 20],
                [6, 43, 15, 2, 44, 16],

                // 11
                [4, 101, 81],
                [1, 80, 50, 4, 81, 51],
                [4, 50, 22, 4, 51, 23],
                [3, 36, 12, 8, 37, 13],

                // 12
                [2, 116, 92, 2, 117, 93],
                [6, 58, 36, 2, 59, 37],
                [4, 46, 20, 6, 47, 21],
                [7, 42, 14, 4, 43, 15],

                // 13
                [4, 133, 107],
                [8, 59, 37, 1, 60, 38],
                [8, 44, 20, 4, 45, 21],
                [12, 33, 11, 4, 34, 12],

                // 14
                [3, 145, 115, 1, 146, 116],
                [4, 64, 40, 5, 65, 41],
                [11, 36, 16, 5, 37, 17],
                [11, 36, 12, 5, 37, 13],

                // 15
                [5, 109, 87, 1, 110, 88],
                [5, 65, 41, 5, 66, 42],
                [5, 54, 24, 7, 55, 25],
                [11, 36, 12, 7, 37, 13],

                // 16
                [5, 122, 98, 1, 123, 99],
                [7, 73, 45, 3, 74, 46],
                [15, 43, 19, 2, 44, 20],
                [3, 45, 15, 13, 46, 16],

                // 17
                [1, 135, 107, 5, 136, 108],
                [10, 74, 46, 1, 75, 47],
                [1, 50, 22, 15, 51, 23],
                [2, 42, 14, 17, 43, 15],

                // 18
                [5, 150, 120, 1, 151, 121],
                [9, 69, 43, 4, 70, 44],
                [17, 50, 22, 1, 51, 23],
                [2, 42, 14, 19, 43, 15],

                // 19
                [3, 141, 113, 4, 142, 114],
                [3, 70, 44, 11, 71, 45],
                [17, 47, 21, 4, 48, 22],
                [9, 39, 13, 16, 40, 14],

                // 20
                [3, 135, 107, 5, 136, 108],
                [3, 67, 41, 13, 68, 42],
                [15, 54, 24, 5, 55, 25],
                [15, 43, 15, 10, 44, 16],

                // 21
                [4, 144, 116, 4, 145, 117],
                [17, 68, 42],
                [17, 50, 22, 6, 51, 23],
                [19, 46, 16, 6, 47, 17],

                // 22
                [2, 139, 111, 7, 140, 112],
                [17, 74, 46],
                [7, 54, 24, 16, 55, 25],
                [34, 37, 13],

                // 23
                [4, 151, 121, 5, 152, 122],
                [4, 75, 47, 14, 76, 48],
                [11, 54, 24, 14, 55, 25],
                [16, 45, 15, 14, 46, 16],

                // 24
                [6, 147, 117, 4, 148, 118],
                [6, 73, 45, 14, 74, 46],
                [11, 54, 24, 16, 55, 25],
                [30, 46, 16, 2, 47, 17],

                // 25
                [8, 132, 106, 4, 133, 107],
                [8, 75, 47, 13, 76, 48],
                [7, 54, 24, 22, 55, 25],
                [22, 45, 15, 13, 46, 16],

                // 26
                [10, 142, 114, 2, 143, 115],
                [19, 74, 46, 4, 75, 47],
                [28, 50, 22, 6, 51, 23],
                [33, 46, 16, 4, 47, 17],

                // 27
                [8, 152, 122, 4, 153, 123],
                [22, 73, 45, 3, 74, 46],
                [8, 53, 23, 26, 54, 24],
                [12, 45, 15, 28, 46, 16],

                // 28
                [3, 147, 117, 10, 148, 118],
                [3, 73, 45, 23, 74, 46],
                [4, 54, 24, 31, 55, 25],
                [11, 45, 15, 31, 46, 16],

                // 29
                [7, 146, 116, 7, 147, 117],
                [21, 73, 45, 7, 74, 46],
                [1, 53, 23, 37, 54, 24],
                [19, 45, 15, 26, 46, 16],

                // 30
                [5, 145, 115, 10, 146, 116],
                [19, 75, 47, 10, 76, 48],
                [15, 54, 24, 25, 55, 25],
                [23, 45, 15, 25, 46, 16],

                // 31
                [13, 145, 115, 3, 146, 116],
                [2, 74, 46, 29, 75, 47],
                [42, 54, 24, 1, 55, 25],
                [23, 45, 15, 28, 46, 16],

                // 32
                [17, 145, 115],
                [10, 74, 46, 23, 75, 47],
                [10, 54, 24, 35, 55, 25],
                [19, 45, 15, 35, 46, 16],

                // 33
                [17, 145, 115, 1, 146, 116],
                [14, 74, 46, 21, 75, 47],
                [29, 54, 24, 19, 55, 25],
                [11, 45, 15, 46, 46, 16],

                // 34
                [13, 145, 115, 6, 146, 116],
                [14, 74, 46, 23, 75, 47],
                [44, 54, 24, 7, 55, 25],
                [59, 46, 16, 1, 47, 17],

                // 35
                [12, 151, 121, 7, 152, 122],
                [12, 75, 47, 26, 76, 48],
                [39, 54, 24, 14, 55, 25],
                [22, 45, 15, 41, 46, 16],

                // 36
                [6, 151, 121, 14, 152, 122],
                [6, 75, 47, 34, 76, 48],
                [46, 54, 24, 10, 55, 25],
                [2, 45, 15, 64, 46, 16],

                // 37
                [17, 152, 122, 4, 153, 123],
                [29, 74, 46, 14, 75, 47],
                [49, 54, 24, 10, 55, 25],
                [24, 45, 15, 46, 46, 16],

                // 38
                [4, 152, 122, 18, 153, 123],
                [13, 74, 46, 32, 75, 47],
                [48, 54, 24, 14, 55, 25],
                [42, 45, 15, 32, 46, 16],

                // 39
                [20, 147, 117, 4, 148, 118],
                [40, 75, 47, 7, 76, 48],
                [43, 54, 24, 22, 55, 25],
                [10, 45, 15, 67, 46, 16],

                // 40
                [19, 148, 118, 6, 149, 119],
                [18, 75, 47, 31, 76, 48],
                [34, 54, 24, 34, 55, 25],
                [20, 45, 15, 61, 46, 16],
            ];

            /**
             * @typedef {{totalCount: number, dataCount: number}} QRRSBlock
             * @param {number} totalCount
             * @param {number} dataCount
             */
            const qrRSBlock = function (totalCount, dataCount) {
                const _this = {};
                _this.totalCount = totalCount;
                _this.dataCount = dataCount;
                return _this;
            };

            const _this = {};

            /**
             * @param {number} typeNumber
             * @param {number} errorCorrectLevel
             */
            const getRsBlockTable = function (typeNumber, errorCorrectLevel) {
                switch (errorCorrectLevel) {
                    case QRErrorCorrectLevel.L:
                        return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 0];
                    case QRErrorCorrectLevel.M:
                        return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 1];
                    case QRErrorCorrectLevel.Q:
                        return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 2];
                    case QRErrorCorrectLevel.H:
                        return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 3];
                    default:
                        return undefined;
                }
            };

            /**
             * @param {number} typeNumber
             * @param {number} errorCorrectLevel
             */
            _this.getRSBlocks = function (typeNumber, errorCorrectLevel) {
                const rsBlock = getRsBlockTable(typeNumber, errorCorrectLevel);

                if (typeof rsBlock === 'undefined') {
                    throw new Error(`bad rs block @ typeNumber:${typeNumber
                    }/errorCorrectLevel:${errorCorrectLevel}`);
                }

                const length = rsBlock.length / 3;
                const list = /** @type {QRRSBlock[]} */ ([]);

                for (let i = 0; i < length; i += 1) {
                    const count = rsBlock[i * 3 + 0];
                    const totalCount = rsBlock[i * 3 + 1];
                    const dataCount = rsBlock[i * 3 + 2];

                    for (let j = 0; j < count; j += 1) {
                        list.push(qrRSBlock(totalCount, dataCount));
                    }
                }

                return list;
            };

            return _this;
        }());

        //---------------------------------------------------------------------
        // qrBitBuffer
        //---------------------------------------------------------------------

        /** @typedef {{getBuffer(): number[], getAt(index: number): boolean, put(num: number, length: number): void, getLengthInBits(): number, putBit(bit: boolean): void}} QrBitBuffer */
        var qrBitBuffer = function () {
            /** @type {number[]} */
            const _buffer = [];
            let _length = 0;
            const _this = {};

            _this.getBuffer = function () {
                return _buffer;
            };

            /**
             * @param {number} index
             */
            _this.getAt = function (index) {
                const bufIndex = Math.floor(index / 8);
                return ((_buffer[bufIndex] >>> (7 - index % 8)) & 1) == 1;
            };

            /**
             * @param {number} num
             * @param {number} length
             */
            _this.put = function (num, length) {
                for (let i = 0; i < length; i += 1) {
                    _this.putBit(((num >>> (length - i - 1)) & 1) == 1);
                }
            };

            _this.getLengthInBits = function () {
                return _length;
            };

            /**
             * @param {boolean} bit
             */
            _this.putBit = function (bit) {
                const bufIndex = Math.floor(_length / 8);
                if (_buffer.length <= bufIndex) {
                    _buffer.push(0);
                }

                if (bit) {
                    _buffer[bufIndex] |= (0x80 >>> (_length % 8));
                }

                _length += 1;
            };

            return _this;
        };

        //---------------------------------------------------------------------
        // qr8BitByte
        //---------------------------------------------------------------------

        /**
         * @param {string} data
         */
        var qr8BitByte = function (data) {
            const _mode = QRMode.MODE_8BIT_BYTE;
            const _bytes = qrcode.stringToBytes(data);
            const _this = {};

            _this.getMode = function () {
                return _mode;
            };

            _this.getLength = function () {
                return _bytes.length;
            };

            /**
             * @param {QrBitBuffer} buffer
             */
            _this.write = function (buffer) {
                for (let i = 0; i < _bytes.length; i += 1) {
                    buffer.put(_bytes[i], 8);
                }
            };

            return _this;
        };

        // returns qrcode function.
        return qrcode;
    }());

    return qrcode; // eslint-disable-line no-undef
}());

