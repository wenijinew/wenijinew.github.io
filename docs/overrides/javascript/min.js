"use strict";
(() => {
  var hn = Object.create;
  var Tr = Object.defineProperty;
  var vn = Object.getOwnPropertyDescriptor;
  var xn = Object.getOwnPropertyNames,
    Kr = Object.getOwnPropertySymbols,
    bn = Object.getPrototypeOf,
    Yr = Object.prototype.hasOwnProperty,
    yn = Object.prototype.propertyIsEnumerable;
  var Jr = (e, r, t) =>
      r in e
        ? Tr(e, r, {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: t,
          })
        : (e[r] = t),
    Ke = (e, r) => {
      for (var t in r || (r = {})) Yr.call(r, t) && Jr(e, t, r[t]);
      if (Kr) for (var t of Kr(r)) yn.call(r, t) && Jr(e, t, r[t]);
      return e;
    };
  var Te = (e, r) => () => (
    r || e((r = { exports: {} }).exports, r), r.exports
  );
  var gn = (e, r, t, n) => {
    if ((r && typeof r == "object") || typeof r == "function")
      for (let o of xn(r))
        !Yr.call(e, o) &&
          o !== t &&
          Tr(e, o, {
            get: () => r[o],
            enumerable: !(n = vn(r, o)) || n.enumerable,
          });
    return e;
  };
  var Xr = (e, r, t) => (
    (t = e != null ? hn(bn(e)) : {}),
    gn(
      r || !e || !e.__esModule
        ? Tr(t, "default", { value: e, enumerable: !0 })
        : t,
      e
    )
  );
  var qe = Te((G) => {
    (function () {
      var e, r, t, n, o, i, f, s, u, a, c, p, l, v, d, m, x, w, E, R;
      (R = 150),
        (a = 20),
        (E = 150),
        (u = 0.75),
        (G.score = function (h, b, S) {
          var T, y, g, _;
          return (
            (y = S.preparedQuery),
            (T = S.allowErrors),
            T || o(h, y.core_lw, y.core_up)
              ? ((_ = h.toLowerCase()), (g = r(h, _, y)), Math.ceil(g))
              : 0
          );
        }),
        (G.isMatch = o =
          function (h, b, S) {
            var T, y, g, _, k, U, C;
            if (((g = h.length), (_ = b.length), !g || _ > g)) return !1;
            for (T = -1, y = -1; ++y < _; ) {
              for (
                k = b.charCodeAt(y), U = S.charCodeAt(y);
                ++T < g && ((C = h.charCodeAt(T)), !(C === k || C === U));

              );
              if (T === g) return !1;
            }
            return !0;
          }),
        (G.computeScore = r =
          function (h, b, S) {
            var T,
              y,
              g,
              _,
              k,
              U,
              C,
              F,
              M,
              j,
              V,
              re,
              q,
              ae,
              de,
              te,
              ve,
              fe,
              wr,
              Oe,
              Qe,
              Sr,
              Er,
              Or;
            if (
              ((de = S.query),
              (te = S.query_lw),
              (j = h.length),
              (q = de.length),
              (T = c(h, b, de, te)),
              (y = T.score),
              T.count === q)
            )
              return v(q, j, y, T.pos);
            if (((ae = b.indexOf(te)), ae > -1))
              return d(h, b, de, te, ae, q, j);
            for (
              Oe = new Array(q),
                k = new Array(q),
                Or = w(q, j),
                V = Math.ceil(u * q) + 5,
                re = V,
                C = !0,
                M = -1;
              ++M < q;

            )
              (Oe[M] = 0), (k[M] = 0);
            for (F = -1; ++F < j; ) {
              if (((Sr = b[F]), !Sr.charCodeAt(0) in S.charCodes)) {
                if (C) {
                  for (M = -1; ++M < q; ) k[M] = 0;
                  C = !1;
                }
                continue;
              }
              for (fe = 0, wr = 0, _ = 0, ve = !0, C = !0, M = -1; ++M < q; ) {
                if (
                  ((Qe = Oe[M]), Qe > fe && (fe = Qe), (U = 0), te[M] === Sr)
                )
                  if (
                    ((Er = s(F, h, b)),
                    (U = _ > 0 ? _ : l(h, b, de, te, F, M, Er)),
                    (g = wr + p(F, M, Er, y, U)),
                    g > fe)
                  )
                    (fe = g), (re = V);
                  else {
                    if (ve && --re <= 0) return Math.max(fe, Oe[q - 1]) * Or;
                    ve = !1;
                  }
                (wr = Qe), (_ = k[M]), (k[M] = U), (Oe[M] = fe);
              }
            }
            return (fe = Oe[q - 1]), fe * Or;
          }),
        (G.isWordStart = s =
          function (h, b, S) {
            var T, y;
            return h === 0
              ? !0
              : ((T = b[h]),
                (y = b[h - 1]),
                i(y) || (T !== S[h] && y === S[h - 1]));
          }),
        (G.isWordEnd = f =
          function (h, b, S, T) {
            var y, g;
            return h === T - 1
              ? !0
              : ((y = b[h]),
                (g = b[h + 1]),
                i(g) || (y === S[h] && g !== S[h + 1]));
          }),
        (i = function (h) {
          return (
            h === " " ||
            h === "." ||
            h === "-" ||
            h === "_" ||
            h === "/" ||
            h === "\\"
          );
        }),
        (x = function (h) {
          var b;
          return h < a ? ((b = a - h), 100 + b * b) : Math.max(100 + a - h, 0);
        }),
        (G.scoreSize = w =
          function (h, b) {
            return E / (E + Math.abs(b - h));
          }),
        (v = function (h, b, S, T) {
          return 2 * h * (R * S + x(T)) * w(h, b);
        }),
        (G.scorePattern = m =
          function (h, b, S, T, y) {
            var g, _;
            return (
              (_ = h),
              (g = 6),
              S === h && (g += 2),
              T && (g += 3),
              y && (g += 1),
              h === b && (T && (S === b ? (_ += 2) : (_ += 1)), y && (g += 1)),
              S + _ * (_ + g)
            );
          }),
        (G.scoreCharacter = p =
          function (h, b, S, T, y) {
            var g;
            return (g = x(h)), S ? g + R * ((T > y ? T : y) + 10) : g + R * y;
          }),
        (G.scoreConsecutives = l =
          function (h, b, S, T, y, g, _) {
            var k, U, C, F, M, j, V;
            for (
              U = h.length,
                F = S.length,
                C = U - y,
                M = F - g,
                k = C < M ? C : M,
                j = 0,
                V = 0,
                S[g] === h[y] && j++;
              ++V < k && T[++g] === b[++y];

            )
              S[g] === h[y] && j++;
            return (
              V < k && y--, V === 1 ? 1 + 2 * j : m(V, F, j, _, f(y, h, b, U))
            );
          }),
        (G.scoreExactMatch = d =
          function (h, b, S, T, y, g, _) {
            var k, U, C, F, M;
            for (
              M = s(y, h, b),
                M ||
                  ((C = b.indexOf(T, y + 1)),
                  C > -1 && ((M = s(C, h, b)), M && (y = C))),
                U = -1,
                F = 0;
              ++U < g;

            )
              S[y + U] === h[U] && F++;
            return (k = f(y + g - 1, h, b, _)), v(g, _, m(g, g, F, M, k), y);
          }),
        (e = (function () {
          function h(b, S, T) {
            (this.score = b), (this.pos = S), (this.count = T);
          }
          return h;
        })()),
        (t = new e(0, 0.1, 0)),
        (G.scoreAcronyms = c =
          function (h, b, S, T) {
            var y, g, _, k, U, C, F, M, j, V, re;
            if (((U = h.length), (C = S.length), !(U > 1 && C > 1))) return t;
            for (y = 0, V = 0, re = 0, M = 0, _ = -1, k = -1; ++k < C; ) {
              if (((F = T[k]), i(F)))
                if (((_ = b.indexOf(F, _ + 1)), _ > -1)) {
                  V++;
                  continue;
                } else break;
              for (; ++_ < U; )
                if (F === b[_] && s(_, h, b)) {
                  S[k] === h[_] && M++, (re += _), y++;
                  break;
                }
              if (_ === U) break;
            }
            return y < 2
              ? t
              : ((g = y === C ? n(h, b, S, y) : !1),
                (j = m(y, C, M, !0, g)),
                new e(j, re / y, y + V));
          }),
        (n = function (h, b, S, T) {
          var y, g, _, k;
          if (((_ = h.length), (k = S.length), (y = 0), _ > 12 * k)) return !1;
          for (g = -1; ++g < _; ) if (s(g, h, b) && ++y > T) return !1;
          return !0;
        });
    }).call(G);
  });
  var yr = Te((De) => {
    (function () {
      var e, r, t, n, o, i, f, s, u, a;
      (a = qe()),
        (i = a.isMatch),
        (e = a.computeScore),
        (s = a.scoreSize),
        (u = 20),
        (t = 2.5),
        (De.score = function (c, p, l) {
          var v, d, m, x;
          return (
            (d = l.preparedQuery),
            (v = l.allowErrors),
            v || i(c, d.core_lw, d.core_up)
              ? ((x = c.toLowerCase()),
                (m = e(c, x, d)),
                (m = f(c, x, m, l)),
                Math.ceil(m))
              : 0
          );
        }),
        (f = function (c, p, l, v) {
          var d, m, x, w, E, R, h, b, S, T;
          if (l === 0) return 0;
          for (
            S = v.preparedQuery,
              T = v.useExtensionBonus,
              b = v.pathSeparator,
              E = c.length - 1;
            c[E] === b;

          )
            E--;
          if (
            ((x = c.lastIndexOf(b, E)),
            (h = E - x),
            (R = 1),
            T && ((R += o(p, S.ext, x, E, 2)), (l *= R)),
            x === -1)
          )
            return l;
          for (w = S.depth; x > -1 && w-- > 0; ) x = c.lastIndexOf(b, x - 1);
          return (
            (m =
              x === -1
                ? l
                : R * e(c.slice(x + 1, E + 1), p.slice(x + 1, E + 1), S)),
            (d = (0.5 * u) / (u + r(c, E + 1, b))),
            d * m + (1 - d) * l * s(0, t * h)
          );
        }),
        (De.countDir = r =
          function (c, p, l) {
            var v, d;
            if (p < 1) return 0;
            for (v = 0, d = -1; ++d < p && c[d] === l; );
            for (; ++d < p; )
              if (c[d] === l) for (v++; ++d < p && c[d] === l; );
            return v;
          }),
        (De.getExtension = n =
          function (c) {
            var p;
            return (p = c.lastIndexOf(".")), p < 0 ? "" : c.substr(p + 1);
          }),
        (o = function (c, p, l, v, d) {
          var m, x, w, E;
          if (!p.length || ((E = c.lastIndexOf(".", v)), !(E > l))) return 0;
          for (
            w = p.length,
              m = v - E,
              m < w && ((w = m), (m = p.length)),
              E++,
              x = -1;
            ++x < w && c[E + x] === p[x];

          );
          return x === 0 && d > 0 ? 0.9 * o(c, p, l, E - 2, d - 1) : x / m;
        });
    }).call(De);
  });
  var qr = Te((Gt, Bt) => {
    (function () {
      var e, r, t, n, o, i, f, s;
      (s = yr()),
        (t = s.countDir),
        (o = s.getExtension),
        (Bt.exports = e =
          (function () {
            function u(a, c) {
              var p, l, v;
              if (
                ((v = c != null ? c : {}),
                (p = v.optCharRegEx),
                (l = v.pathSeparator),
                !(a && a.length))
              )
                return null;
              (this.query = a),
                (this.query_lw = a.toLowerCase()),
                (this.core = r(a, p)),
                (this.core_lw = this.core.toLowerCase()),
                (this.core_up = f(this.core)),
                (this.depth = t(a, a.length, l)),
                (this.ext = o(this.query_lw)),
                (this.charCodes = n(this.query_lw));
            }
            return u;
          })()),
        (i = /[ _\-:\/\\]/g),
        (r = function (u, a) {
          return a == null && (a = i), u.replace(a, "");
        }),
        (f = function (u) {
          var a, c, p, l;
          for (c = "", p = 0, l = u.length; p < l; p++)
            (a = u[p]), (c += a.toUpperCase()[0]);
          return c;
        }),
        (n = function (u) {
          var a, c, p;
          for (p = u.length, c = -1, a = []; ++c < p; )
            a[u.charCodeAt(c)] = !0;
          return a;
        });
    }).call(Gt);
  });
  var rn = Te((Zt, en) => {
    (function () {
      var e, r, t, n, o;
      (n = qe()),
        (r = yr()),
        (e = qr()),
        (t = function (i) {
          return i.candidate;
        }),
        (o = function (i, f) {
          return f.score - i.score;
        }),
        (en.exports = function (i, f, s) {
          var u, a, c, p, l, v, d, m, x, w, E, R, h;
          for (
            m = [],
              c = s.key,
              l = s.maxResults,
              p = s.maxInners,
              E = s.usePathScoring,
              x = p != null && p > 0 ? p : i.length + 1,
              u = c != null,
              d = E ? r : n,
              R = 0,
              h = i.length;
            R < h &&
            ((a = i[R]),
            (w = u ? a[c] : a),
            !(
              !!w &&
              ((v = d.score(w, f, s)),
              v > 0 && (m.push({ candidate: a, score: v }), !--x))
            ));
            R++
          );
          return (
            m.sort(o), (i = m.map(t)), l != null && (i = i.slice(0, l)), i
          );
        });
    }).call(Zt);
  });
  var tn = Te((gr) => {
    (function () {
      var e, r, t, n, o, i, f, s, u, a;
      (a = qe()),
        (t = a.isMatch),
        (n = a.isWordStart),
        (u = a.scoreConsecutives),
        (s = a.scoreCharacter),
        (f = a.scoreAcronyms),
        (gr.match = o =
          function (c, p, l) {
            var v, d, m, x, w, E;
            return (
              (v = l.allowErrors),
              (w = l.preparedQuery),
              (x = l.pathSeparator),
              v || t(c, w.core_lw, w.core_up)
                ? ((E = c.toLowerCase()),
                  (m = r(c, E, w)),
                  m.length === 0 ||
                    (c.indexOf(x) > -1 &&
                      ((d = e(c, E, w, x)), (m = i(m, d)))),
                  m)
                : []
            );
          }),
        (gr.wrap = function (c, p, l) {
          var v, d, m, x, w, E, R, h, b;
          if (
            (l.wrap != null &&
              ((b = l.wrap),
              (E = b.tagClass),
              (h = b.tagOpen),
              (R = b.tagClose)),
            E == null && (E = "highlight"),
            h == null && (h = '<strong class="' + E + '">'),
            R == null && (R = "</strong>"),
            c === p)
          )
            return h + c + R;
          if (((m = o(c, p, l)), m.length === 0)) return c;
          for (x = "", v = -1, w = 0; ++v < m.length; ) {
            for (
              d = m[v], d > w && ((x += c.substring(w, d)), (w = d));
              ++v < m.length;

            )
              if (m[v] === d + 1) d++;
              else {
                v--;
                break;
              }
            d++,
              d > w && ((x += h), (x += c.substring(w, d)), (x += R), (w = d));
          }
          return w <= c.length - 1 && (x += c.substring(w)), x;
        }),
        (e = function (c, p, l, v) {
          var d, m, x;
          for (x = c.length - 1; c[x] === v; ) x--;
          if (((d = c.lastIndexOf(v, x)), d === -1)) return [];
          for (m = l.depth; m-- > 0; )
            if (((d = c.lastIndexOf(v, d - 1)), d === -1)) return [];
          return d++, x++, r(c.slice(d, x), p.slice(d, x), l, d);
        }),
        (i = function (c, p) {
          var l, v, d, m, x, w, E;
          if (((x = c.length), (w = p.length), w === 0)) return c.slice();
          if (x === 0) return p.slice();
          for (d = -1, m = 0, v = p[m], E = []; ++d < x; ) {
            for (l = c[d]; v <= l && ++m < w; ) v < l && E.push(v), (v = p[m]);
            E.push(l);
          }
          for (; m < w; ) E.push(p[m++]);
          return E;
        }),
        (r = function (c, p, l, v) {
          var d,
            m,
            x,
            w,
            E,
            R,
            h,
            b,
            S,
            T,
            y,
            g,
            _,
            k,
            U,
            C,
            F,
            M,
            j,
            V,
            re,
            q,
            ae,
            de,
            te,
            ve;
          for (
            v == null && (v = 0),
              M = l.query,
              j = l.query_lw,
              _ = c.length,
              C = M.length,
              E = f(c, p, M, j).score,
              q = new Array(C),
              S = new Array(C),
              x = 0,
              w = 1,
              m = 2,
              d = 3,
              ve = new Array(_ * C),
              F = -1,
              g = -1;
            ++g < C;

          )
            (q[g] = 0), (S[g] = 0);
          for (y = -1; ++y < _; )
            for (V = 0, ae = 0, b = 0, de = p[y], g = -1; ++g < C; )
              (T = 0),
                (R = 0),
                (re = ae),
                j[g] === de &&
                  ((te = n(y, c, p)),
                  (T = b > 0 ? b : u(c, p, M, j, y, g, te)),
                  (R = re + s(y, g, te, E, T))),
                (ae = q[g]),
                (b = S[g]),
                V > ae ? (U = m) : ((V = ae), (U = w)),
                R > V ? ((V = R), (U = d)) : (T = 0),
                (q[g] = V),
                (S[g] = T),
                (ve[++F] = V > 0 ? U : x);
          for (
            y = _ - 1, g = C - 1, F = y * C + g, h = !0, k = [];
            h && y >= 0 && g >= 0;

          )
            switch (ve[F]) {
              case w:
                y--, (F -= C);
                break;
              case m:
                g--, F--;
                break;
              case d:
                k.push(y + v), g--, y--, (F -= C + 1);
                break;
              default:
                h = !1;
            }
          return k.reverse(), k;
        });
    }).call(gr);
  });
  var Dr = Te((nn, on) => {
    (function () {
      var e, r, t, n, o, i, f, s;
      (t = rn()),
        (n = tn()),
        (s = qe()),
        (i = yr()),
        (e = qr()),
        (f = null),
        (r =
          (typeof process != "undefined" && process !== null
            ? process.platform
            : void 0) === "win32"
            ? "\\"
            : "/"),
        (on.exports = {
          filter: function (u, a, c) {
            return (
              c == null && (c = {}),
              a != null && a.length && u != null && u.length
                ? ((c = o(c, a)), t(u, a, c))
                : []
            );
          },
          score: function (u, a, c) {
            return (
              c == null && (c = {}),
              u != null && u.length && a != null && a.length
                ? ((c = o(c, a)),
                  c.usePathScoring ? i.score(u, a, c) : s.score(u, a, c))
                : 0
            );
          },
          match: function (u, a, c) {
            var p, l, v;
            return (
              c == null && (c = {}),
              u
                ? a
                  ? u === a
                    ? function () {
                        v = [];
                        for (
                          var d = 0, m = u.length;
                          0 <= m ? d < m : d > m;
                          0 <= m ? d++ : d--
                        )
                          v.push(d);
                        return v;
                      }.apply(this)
                    : ((c = o(c, a)), n.match(u, a, c))
                  : []
                : []
            );
          },
          wrap: function (u, a, c) {
            return (
              c == null && (c = {}),
              u ? (a ? ((c = o(c, a)), n.wrap(u, a, c)) : []) : []
            );
          },
          prepareQuery: function (u, a) {
            return a == null && (a = {}), (a = o(a, u)), a.preparedQuery;
          },
        }),
        (o = function (u, a) {
          return (
            u.allowErrors == null && (u.allowErrors = !1),
            u.usePathScoring == null && (u.usePathScoring = !0),
            u.useExtensionBonus == null && (u.useExtensionBonus = !1),
            u.pathSeparator == null && (u.pathSeparator = r),
            u.optCharRegEx == null && (u.optCharRegEx = null),
            u.wrap == null && (u.wrap = null),
            u.preparedQuery == null &&
              (u.preparedQuery = f && f.query === a ? f : (f = new e(a, u))),
            u
          );
        });
    }).call(nn);
  });
  /*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */ var _r =
    function (e, r) {
      return (
        (_r =
          Object.setPrototypeOf ||
          ({ __proto__: [] } instanceof Array &&
            function (t, n) {
              t.__proto__ = n;
            }) ||
          function (t, n) {
            for (var o in n)
              Object.prototype.hasOwnProperty.call(n, o) && (t[o] = n[o]);
          }),
        _r(e, r)
      );
    };
  function $(e, r) {
    if (typeof r != "function" && r !== null)
      throw new TypeError(
        "Class extends value " + String(r) + " is not a constructor or null"
      );
    _r(e, r);
    function t() {
      this.constructor = e;
    }
    e.prototype =
      r === null ? Object.create(r) : ((t.prototype = r.prototype), new t());
  }
  function Gr(e, r, t, n) {
    function o(i) {
      return i instanceof t
        ? i
        : new t(function (f) {
            f(i);
          });
    }
    return new (t || (t = Promise))(function (i, f) {
      function s(c) {
        try {
          a(n.next(c));
        } catch (p) {
          f(p);
        }
      }
      function u(c) {
        try {
          a(n.throw(c));
        } catch (p) {
          f(p);
        }
      }
      function a(c) {
        c.done ? i(c.value) : o(c.value).then(s, u);
      }
      a((n = n.apply(e, r || [])).next());
    });
  }
  function Je(e, r) {
    var t = {
        label: 0,
        sent: function () {
          if (i[0] & 1) throw i[1];
          return i[1];
        },
        trys: [],
        ops: [],
      },
      n,
      o,
      i,
      f;
    return (
      (f = { next: s(0), throw: s(1), return: s(2) }),
      typeof Symbol == "function" &&
        (f[Symbol.iterator] = function () {
          return this;
        }),
      f
    );
    function s(a) {
      return function (c) {
        return u([a, c]);
      };
    }
    function u(a) {
      if (n) throw new TypeError("Generator is already executing.");
      for (; t; )
        try {
          if (
            ((n = 1),
            o &&
              (i =
                a[0] & 2
                  ? o.return
                  : a[0]
                  ? o.throw || ((i = o.return) && i.call(o), 0)
                  : o.next) &&
              !(i = i.call(o, a[1])).done)
          )
            return i;
          switch (((o = 0), i && (a = [a[0] & 2, i.value]), a[0])) {
            case 0:
            case 1:
              i = a;
              break;
            case 4:
              return t.label++, { value: a[1], done: !1 };
            case 5:
              t.label++, (o = a[1]), (a = [0]);
              continue;
            case 7:
              (a = t.ops.pop()), t.trys.pop();
              continue;
            default:
              if (
                ((i = t.trys),
                !(i = i.length > 0 && i[i.length - 1]) &&
                  (a[0] === 6 || a[0] === 2))
              ) {
                t = 0;
                continue;
              }
              if (a[0] === 3 && (!i || (a[1] > i[0] && a[1] < i[3]))) {
                t.label = a[1];
                break;
              }
              if (a[0] === 6 && t.label < i[1]) {
                (t.label = i[1]), (i = a);
                break;
              }
              if (i && t.label < i[2]) {
                (t.label = i[2]), t.ops.push(a);
                break;
              }
              i[2] && t.ops.pop(), t.trys.pop();
              continue;
          }
          a = r.call(e, t);
        } catch (c) {
          (a = [6, c]), (o = 0);
        } finally {
          n = i = 0;
        }
      if (a[0] & 5) throw a[1];
      return { value: a[0] ? a[1] : void 0, done: !0 };
    }
  }
  function Y(e) {
    var r = typeof Symbol == "function" && Symbol.iterator,
      t = r && e[r],
      n = 0;
    if (t) return t.call(e);
    if (e && typeof e.length == "number")
      return {
        next: function () {
          return (
            e && n >= e.length && (e = void 0),
            { value: e && e[n++], done: !e }
          );
        },
      };
    throw new TypeError(
      r ? "Object is not iterable." : "Symbol.iterator is not defined."
    );
  }
  function W(e, r) {
    var t = typeof Symbol == "function" && e[Symbol.iterator];
    if (!t) return e;
    var n = t.call(e),
      o,
      i = [],
      f;
    try {
      for (; (r === void 0 || r-- > 0) && !(o = n.next()).done; )
        i.push(o.value);
    } catch (s) {
      f = { error: s };
    } finally {
      try {
        o && !o.done && (t = n.return) && t.call(n);
      } finally {
        if (f) throw f.error;
      }
    }
    return i;
  }
  function z(e, r, t) {
    if (t || arguments.length === 2)
      for (var n = 0, o = r.length, i; n < o; n++)
        (i || !(n in r)) &&
          (i || (i = Array.prototype.slice.call(r, 0, n)), (i[n] = r[n]));
    return e.concat(i || Array.prototype.slice.call(r));
  }
  function xe(e) {
    return this instanceof xe ? ((this.v = e), this) : new xe(e);
  }
  function Br(e, r, t) {
    if (!Symbol.asyncIterator)
      throw new TypeError("Symbol.asyncIterator is not defined.");
    var n = t.apply(e, r || []),
      o,
      i = [];
    return (
      (o = {}),
      f("next"),
      f("throw"),
      f("return"),
      (o[Symbol.asyncIterator] = function () {
        return this;
      }),
      o
    );
    function f(l) {
      n[l] &&
        (o[l] = function (v) {
          return new Promise(function (d, m) {
            i.push([l, v, d, m]) > 1 || s(l, v);
          });
        });
    }
    function s(l, v) {
      try {
        u(n[l](v));
      } catch (d) {
        p(i[0][3], d);
      }
    }
    function u(l) {
      l.value instanceof xe
        ? Promise.resolve(l.value.v).then(a, c)
        : p(i[0][2], l);
    }
    function a(l) {
      s("next", l);
    }
    function c(l) {
      s("throw", l);
    }
    function p(l, v) {
      l(v), i.shift(), i.length && s(i[0][0], i[0][1]);
    }
  }
  function Zr(e) {
    if (!Symbol.asyncIterator)
      throw new TypeError("Symbol.asyncIterator is not defined.");
    var r = e[Symbol.asyncIterator],
      t;
    return r
      ? r.call(e)
      : ((e = typeof Y == "function" ? Y(e) : e[Symbol.iterator]()),
        (t = {}),
        n("next"),
        n("throw"),
        n("return"),
        (t[Symbol.asyncIterator] = function () {
          return this;
        }),
        t);
    function n(i) {
      t[i] =
        e[i] &&
        function (f) {
          return new Promise(function (s, u) {
            (f = e[i](f)), o(s, u, f.done, f.value);
          });
        };
    }
    function o(i, f, s, u) {
      Promise.resolve(u).then(function (a) {
        i({ value: a, done: s });
      }, f);
    }
  }
  function O(e) {
    return typeof e == "function";
  }
  function Ye(e) {
    var r = function (n) {
        Error.call(n), (n.stack = new Error().stack);
      },
      t = e(r);
    return (
      (t.prototype = Object.create(Error.prototype)),
      (t.prototype.constructor = t),
      t
    );
  }
  var Xe = Ye(function (e) {
    return function (t) {
      e(this),
        (this.message = t
          ? t.length +
            ` errors occurred during unsubscription:
` +
            t.map(function (n, o) {
              return o + 1 + ") " + n.toString();
            }).join(`
  `)
          : ""),
        (this.name = "UnsubscriptionError"),
        (this.errors = t);
    };
  });
  function ue(e, r) {
    if (e) {
      var t = e.indexOf(r);
      0 <= t && e.splice(t, 1);
    }
  }
  var ne = (function () {
    function e(r) {
      (this.initialTeardown = r),
        (this.closed = !1),
        (this._parentage = null),
        (this._finalizers = null);
    }
    return (
      (e.prototype.unsubscribe = function () {
        var r, t, n, o, i;
        if (!this.closed) {
          this.closed = !0;
          var f = this._parentage;
          if (f)
            if (((this._parentage = null), Array.isArray(f)))
              try {
                for (var s = Y(f), u = s.next(); !u.done; u = s.next()) {
                  var a = u.value;
                  a.remove(this);
                }
              } catch (m) {
                r = { error: m };
              } finally {
                try {
                  u && !u.done && (t = s.return) && t.call(s);
                } finally {
                  if (r) throw r.error;
                }
              }
            else f.remove(this);
          var c = this.initialTeardown;
          if (O(c))
            try {
              c();
            } catch (m) {
              i = m instanceof Xe ? m.errors : [m];
            }
          var p = this._finalizers;
          if (p) {
            this._finalizers = null;
            try {
              for (var l = Y(p), v = l.next(); !v.done; v = l.next()) {
                var d = v.value;
                try {
                  et(d);
                } catch (m) {
                  (i = i != null ? i : []),
                    m instanceof Xe
                      ? (i = z(z([], W(i)), W(m.errors)))
                      : i.push(m);
                }
              }
            } catch (m) {
              n = { error: m };
            } finally {
              try {
                v && !v.done && (o = l.return) && o.call(l);
              } finally {
                if (n) throw n.error;
              }
            }
          }
          if (i) throw new Xe(i);
        }
      }),
      (e.prototype.add = function (r) {
        var t;
        if (r && r !== this)
          if (this.closed) et(r);
          else {
            if (r instanceof e) {
              if (r.closed || r._hasParent(this)) return;
              r._addParent(this);
            }
            (this._finalizers =
              (t = this._finalizers) !== null && t !== void 0 ? t : []).push(
              r
            );
          }
      }),
      (e.prototype._hasParent = function (r) {
        var t = this._parentage;
        return t === r || (Array.isArray(t) && t.includes(r));
      }),
      (e.prototype._addParent = function (r) {
        var t = this._parentage;
        this._parentage = Array.isArray(t) ? (t.push(r), t) : t ? [t, r] : r;
      }),
      (e.prototype._removeParent = function (r) {
        var t = this._parentage;
        t === r ? (this._parentage = null) : Array.isArray(t) && ue(t, r);
      }),
      (e.prototype.remove = function (r) {
        var t = this._finalizers;
        t && ue(t, r), r instanceof e && r._removeParent(this);
      }),
      (e.EMPTY = (function () {
        var r = new e();
        return (r.closed = !0), r;
      })()),
      e
    );
  })();
  var Ar = ne.EMPTY;
  function Ge(e) {
    return (
      e instanceof ne ||
      (e && "closed" in e && O(e.remove) && O(e.add) && O(e.unsubscribe))
    );
  }
  function et(e) {
    O(e) ? e() : e.unsubscribe();
  }
  var ee = {
    onUnhandledError: null,
    onStoppedNotification: null,
    Promise: void 0,
    useDeprecatedSynchronousErrorHandling: !1,
    useDeprecatedNextContext: !1,
  };
  var _e = {
    setTimeout: function (e, r) {
      for (var t = [], n = 2; n < arguments.length; n++)
        t[n - 2] = arguments[n];
      var o = _e.delegate;
      return o != null && o.setTimeout
        ? o.setTimeout.apply(o, z([e, r], W(t)))
        : setTimeout.apply(void 0, z([e, r], W(t)));
    },
    clearTimeout: function (e) {
      var r = _e.delegate;
      return ((r == null ? void 0 : r.clearTimeout) || clearTimeout)(e);
    },
    delegate: void 0,
  };
  function Be(e) {
    _e.setTimeout(function () {
      var r = ee.onUnhandledError;
      if (r) r(e);
      else throw e;
    });
  }
  function ce() {}
  var rt = (function () {
    return Mr("C", void 0, void 0);
  })();
  function tt(e) {
    return Mr("E", void 0, e);
  }
  function nt(e) {
    return Mr("N", e, void 0);
  }
  function Mr(e, r, t) {
    return { kind: e, value: r, error: t };
  }
  var be = null;
  function Ae(e) {
    if (ee.useDeprecatedSynchronousErrorHandling) {
      var r = !be;
      if ((r && (be = { errorThrown: !1, error: null }), e(), r)) {
        var t = be,
          n = t.errorThrown,
          o = t.error;
        if (((be = null), n)) throw o;
      }
    } else e();
  }
  function ot(e) {
    ee.useDeprecatedSynchronousErrorHandling &&
      be &&
      ((be.errorThrown = !0), (be.error = e));
  }
  var Ue = (function (e) {
    $(r, e);
    function r(t) {
      var n = e.call(this) || this;
      return (
        (n.isStopped = !1),
        t ? ((n.destination = t), Ge(t) && t.add(n)) : (n.destination = On),
        n
      );
    }
    return (
      (r.create = function (t, n, o) {
        return new ye(t, n, o);
      }),
      (r.prototype.next = function (t) {
        this.isStopped ? Cr(nt(t), this) : this._next(t);
      }),
      (r.prototype.error = function (t) {
        this.isStopped
          ? Cr(tt(t), this)
          : ((this.isStopped = !0), this._error(t));
      }),
      (r.prototype.complete = function () {
        this.isStopped
          ? Cr(rt, this)
          : ((this.isStopped = !0), this._complete());
      }),
      (r.prototype.unsubscribe = function () {
        this.closed ||
          ((this.isStopped = !0),
          e.prototype.unsubscribe.call(this),
          (this.destination = null));
      }),
      (r.prototype._next = function (t) {
        this.destination.next(t);
      }),
      (r.prototype._error = function (t) {
        try {
          this.destination.error(t);
        } finally {
          this.unsubscribe();
        }
      }),
      (r.prototype._complete = function () {
        try {
          this.destination.complete();
        } finally {
          this.unsubscribe();
        }
      }),
      r
    );
  })(ne);
  var wn = Function.prototype.bind;
  function Ir(e, r) {
    return wn.call(e, r);
  }
  var Sn = (function () {
      function e(r) {
        this.partialObserver = r;
      }
      return (
        (e.prototype.next = function (r) {
          var t = this.partialObserver;
          if (t.next)
            try {
              t.next(r);
            } catch (n) {
              Ze(n);
            }
        }),
        (e.prototype.error = function (r) {
          var t = this.partialObserver;
          if (t.error)
            try {
              t.error(r);
            } catch (n) {
              Ze(n);
            }
          else Ze(r);
        }),
        (e.prototype.complete = function () {
          var r = this.partialObserver;
          if (r.complete)
            try {
              r.complete();
            } catch (t) {
              Ze(t);
            }
        }),
        e
      );
    })(),
    ye = (function (e) {
      $(r, e);
      function r(t, n, o) {
        var i = e.call(this) || this,
          f;
        if (O(t) || !t)
          f = {
            next: t != null ? t : void 0,
            error: n != null ? n : void 0,
            complete: o != null ? o : void 0,
          };
        else {
          var s;
          i && ee.useDeprecatedNextContext
            ? ((s = Object.create(t)),
              (s.unsubscribe = function () {
                return i.unsubscribe();
              }),
              (f = {
                next: t.next && Ir(t.next, s),
                error: t.error && Ir(t.error, s),
                complete: t.complete && Ir(t.complete, s),
              }))
            : (f = t);
        }
        return (i.destination = new Sn(f)), i;
      }
      return r;
    })(Ue);
  function Ze(e) {
    ee.useDeprecatedSynchronousErrorHandling ? ot(e) : Be(e);
  }
  function En(e) {
    throw e;
  }
  function Cr(e, r) {
    var t = ee.onStoppedNotification;
    t &&
      _e.setTimeout(function () {
        return t(e, r);
      });
  }
  var On = { closed: !0, next: ce, error: En, complete: ce };
  var Me = (function () {
    return (
      (typeof Symbol == "function" && Symbol.observable) || "@@observable"
    );
  })();
  function X(e) {
    return e;
  }
  function it(e) {
    return e.length === 0
      ? X
      : e.length === 1
      ? e[0]
      : function (t) {
          return e.reduce(function (n, o) {
            return o(n);
          }, t);
        };
  }
  var I = (function () {
    function e(r) {
      r && (this._subscribe = r);
    }
    return (
      (e.prototype.lift = function (r) {
        var t = new e();
        return (t.source = this), (t.operator = r), t;
      }),
      (e.prototype.subscribe = function (r, t, n) {
        var o = this,
          i = _n(r) ? r : new ye(r, t, n);
        return (
          Ae(function () {
            var f = o,
              s = f.operator,
              u = f.source;
            i.add(s ? s.call(i, u) : u ? o._subscribe(i) : o._trySubscribe(i));
          }),
          i
        );
      }),
      (e.prototype._trySubscribe = function (r) {
        try {
          return this._subscribe(r);
        } catch (t) {
          r.error(t);
        }
      }),
      (e.prototype.forEach = function (r, t) {
        var n = this;
        return (
          (t = at(t)),
          new t(function (o, i) {
            var f = new ye({
              next: function (s) {
                try {
                  r(s);
                } catch (u) {
                  i(u), f.unsubscribe();
                }
              },
              error: i,
              complete: o,
            });
            n.subscribe(f);
          })
        );
      }),
      (e.prototype._subscribe = function (r) {
        var t;
        return (t = this.source) === null || t === void 0
          ? void 0
          : t.subscribe(r);
      }),
      (e.prototype[Me] = function () {
        return this;
      }),
      (e.prototype.pipe = function () {
        for (var r = [], t = 0; t < arguments.length; t++) r[t] = arguments[t];
        return it(r)(this);
      }),
      (e.prototype.toPromise = function (r) {
        var t = this;
        return (
          (r = at(r)),
          new r(function (n, o) {
            var i;
            t.subscribe(
              function (f) {
                return (i = f);
              },
              function (f) {
                return o(f);
              },
              function () {
                return n(i);
              }
            );
          })
        );
      }),
      (e.create = function (r) {
        return new e(r);
      }),
      e
    );
  })();
  function at(e) {
    var r;
    return (r = e != null ? e : ee.Promise) !== null && r !== void 0
      ? r
      : Promise;
  }
  function Tn(e) {
    return e && O(e.next) && O(e.error) && O(e.complete);
  }
  function _n(e) {
    return (e && e instanceof Ue) || (Tn(e) && Ge(e));
  }
  function An(e) {
    return O(e == null ? void 0 : e.lift);
  }
  function A(e) {
    return function (r) {
      if (An(r))
        return r.lift(function (t) {
          try {
            return e(t, this);
          } catch (n) {
            this.error(n);
          }
        });
      throw new TypeError("Unable to lift unknown Observable type");
    };
  }
  function L(e, r, t, n, o) {
    return new Mn(e, r, t, n, o);
  }
  var Mn = (function (e) {
    $(r, e);
    function r(t, n, o, i, f, s) {
      var u = e.call(this, t) || this;
      return (
        (u.onFinalize = f),
        (u.shouldUnsubscribe = s),
        (u._next = n
          ? function (a) {
              try {
                n(a);
              } catch (c) {
                t.error(c);
              }
            }
          : e.prototype._next),
        (u._error = i
          ? function (a) {
              try {
                i(a);
              } catch (c) {
                t.error(c);
              } finally {
                this.unsubscribe();
              }
            }
          : e.prototype._error),
        (u._complete = o
          ? function () {
              try {
                o();
              } catch (a) {
                t.error(a);
              } finally {
                this.unsubscribe();
              }
            }
          : e.prototype._complete),
        u
      );
    }
    return (
      (r.prototype.unsubscribe = function () {
        var t;
        if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
          var n = this.closed;
          e.prototype.unsubscribe.call(this),
            !n &&
              ((t = this.onFinalize) === null || t === void 0 || t.call(this));
        }
      }),
      r
    );
  })(Ue);
  var Ie = {
    schedule: function (e) {
      var r = requestAnimationFrame,
        t = cancelAnimationFrame,
        n = Ie.delegate;
      n && ((r = n.requestAnimationFrame), (t = n.cancelAnimationFrame));
      var o = r(function (i) {
        (t = void 0), e(i);
      });
      return new ne(function () {
        return t == null ? void 0 : t(o);
      });
    },
    requestAnimationFrame: function () {
      for (var e = [], r = 0; r < arguments.length; r++) e[r] = arguments[r];
      var t = Ie.delegate;
      return (
        (t == null ? void 0 : t.requestAnimationFrame) || requestAnimationFrame
      ).apply(void 0, z([], W(e)));
    },
    cancelAnimationFrame: function () {
      for (var e = [], r = 0; r < arguments.length; r++) e[r] = arguments[r];
      var t = Ie.delegate;
      return (
        (t == null ? void 0 : t.cancelAnimationFrame) || cancelAnimationFrame
      ).apply(void 0, z([], W(e)));
    },
    delegate: void 0,
  };
  var ft = Ye(function (e) {
    return function () {
      e(this),
        (this.name = "ObjectUnsubscribedError"),
        (this.message = "object unsubscribed");
    };
  });
  var B = (function (e) {
    $(r, e);
    function r() {
      var t = e.call(this) || this;
      return (
        (t.closed = !1),
        (t.currentObservers = null),
        (t.observers = []),
        (t.isStopped = !1),
        (t.hasError = !1),
        (t.thrownError = null),
        t
      );
    }
    return (
      (r.prototype.lift = function (t) {
        var n = new ut(this, this);
        return (n.operator = t), n;
      }),
      (r.prototype._throwIfClosed = function () {
        if (this.closed) throw new ft();
      }),
      (r.prototype.next = function (t) {
        var n = this;
        Ae(function () {
          var o, i;
          if ((n._throwIfClosed(), !n.isStopped)) {
            n.currentObservers ||
              (n.currentObservers = Array.from(n.observers));
            try {
              for (
                var f = Y(n.currentObservers), s = f.next();
                !s.done;
                s = f.next()
              ) {
                var u = s.value;
                u.next(t);
              }
            } catch (a) {
              o = { error: a };
            } finally {
              try {
                s && !s.done && (i = f.return) && i.call(f);
              } finally {
                if (o) throw o.error;
              }
            }
          }
        });
      }),
      (r.prototype.error = function (t) {
        var n = this;
        Ae(function () {
          if ((n._throwIfClosed(), !n.isStopped)) {
            (n.hasError = n.isStopped = !0), (n.thrownError = t);
            for (var o = n.observers; o.length; ) o.shift().error(t);
          }
        });
      }),
      (r.prototype.complete = function () {
        var t = this;
        Ae(function () {
          if ((t._throwIfClosed(), !t.isStopped)) {
            t.isStopped = !0;
            for (var n = t.observers; n.length; ) n.shift().complete();
          }
        });
      }),
      (r.prototype.unsubscribe = function () {
        (this.isStopped = this.closed = !0),
          (this.observers = this.currentObservers = null);
      }),
      Object.defineProperty(r.prototype, "observed", {
        get: function () {
          var t;
          return (
            ((t = this.observers) === null || t === void 0
              ? void 0
              : t.length) > 0
          );
        },
        enumerable: !1,
        configurable: !0,
      }),
      (r.prototype._trySubscribe = function (t) {
        return this._throwIfClosed(), e.prototype._trySubscribe.call(this, t);
      }),
      (r.prototype._subscribe = function (t) {
        return (
          this._throwIfClosed(),
          this._checkFinalizedStatuses(t),
          this._innerSubscribe(t)
        );
      }),
      (r.prototype._innerSubscribe = function (t) {
        var n = this,
          o = this,
          i = o.hasError,
          f = o.isStopped,
          s = o.observers;
        return i || f
          ? Ar
          : ((this.currentObservers = null),
            s.push(t),
            new ne(function () {
              (n.currentObservers = null), ue(s, t);
            }));
      }),
      (r.prototype._checkFinalizedStatuses = function (t) {
        var n = this,
          o = n.hasError,
          i = n.thrownError,
          f = n.isStopped;
        o ? t.error(i) : f && t.complete();
      }),
      (r.prototype.asObservable = function () {
        var t = new I();
        return (t.source = this), t;
      }),
      (r.create = function (t, n) {
        return new ut(t, n);
      }),
      r
    );
  })(I);
  var ut = (function (e) {
    $(r, e);
    function r(t, n) {
      var o = e.call(this) || this;
      return (o.destination = t), (o.source = n), o;
    }
    return (
      (r.prototype.next = function (t) {
        var n, o;
        (o =
          (n = this.destination) === null || n === void 0
            ? void 0
            : n.next) === null ||
          o === void 0 ||
          o.call(n, t);
      }),
      (r.prototype.error = function (t) {
        var n, o;
        (o =
          (n = this.destination) === null || n === void 0
            ? void 0
            : n.error) === null ||
          o === void 0 ||
          o.call(n, t);
      }),
      (r.prototype.complete = function () {
        var t, n;
        (n =
          (t = this.destination) === null || t === void 0
            ? void 0
            : t.complete) === null ||
          n === void 0 ||
          n.call(t);
      }),
      (r.prototype._subscribe = function (t) {
        var n, o;
        return (o =
          (n = this.source) === null || n === void 0
            ? void 0
            : n.subscribe(t)) !== null && o !== void 0
          ? o
          : Ar;
      }),
      r
    );
  })(B);
  var ze = {
    now: function () {
      return (ze.delegate || Date).now();
    },
    delegate: void 0,
  };
  var ct = (function (e) {
    $(r, e);
    function r(t, n, o) {
      t === void 0 && (t = 1 / 0),
        n === void 0 && (n = 1 / 0),
        o === void 0 && (o = ze);
      var i = e.call(this) || this;
      return (
        (i._bufferSize = t),
        (i._windowTime = n),
        (i._timestampProvider = o),
        (i._buffer = []),
        (i._infiniteTimeWindow = !0),
        (i._infiniteTimeWindow = n === 1 / 0),
        (i._bufferSize = Math.max(1, t)),
        (i._windowTime = Math.max(1, n)),
        i
      );
    }
    return (
      (r.prototype.next = function (t) {
        var n = this,
          o = n.isStopped,
          i = n._buffer,
          f = n._infiniteTimeWindow,
          s = n._timestampProvider,
          u = n._windowTime;
        o || (i.push(t), !f && i.push(s.now() + u)),
          this._trimBuffer(),
          e.prototype.next.call(this, t);
      }),
      (r.prototype._subscribe = function (t) {
        this._throwIfClosed(), this._trimBuffer();
        for (
          var n = this._innerSubscribe(t),
            o = this,
            i = o._infiniteTimeWindow,
            f = o._buffer,
            s = f.slice(),
            u = 0;
          u < s.length && !t.closed;
          u += i ? 1 : 2
        )
          t.next(s[u]);
        return this._checkFinalizedStatuses(t), n;
      }),
      (r.prototype._trimBuffer = function () {
        var t = this,
          n = t._bufferSize,
          o = t._timestampProvider,
          i = t._buffer,
          f = t._infiniteTimeWindow,
          s = (f ? 1 : 2) * n;
        if ((n < 1 / 0 && s < i.length && i.splice(0, i.length - s), !f)) {
          for (
            var u = o.now(), a = 0, c = 1;
            c < i.length && i[c] <= u;
            c += 2
          )
            a = c;
          a && i.splice(0, a + 1);
        }
      }),
      r
    );
  })(B);
  var st = (function (e) {
    $(r, e);
    function r(t, n) {
      return e.call(this) || this;
    }
    return (
      (r.prototype.schedule = function (t, n) {
        return n === void 0 && (n = 0), this;
      }),
      r
    );
  })(ne);
  var Ve = {
    setInterval: function (e, r) {
      for (var t = [], n = 2; n < arguments.length; n++)
        t[n - 2] = arguments[n];
      var o = Ve.delegate;
      return o != null && o.setInterval
        ? o.setInterval.apply(o, z([e, r], W(t)))
        : setInterval.apply(void 0, z([e, r], W(t)));
    },
    clearInterval: function (e) {
      var r = Ve.delegate;
      return ((r == null ? void 0 : r.clearInterval) || clearInterval)(e);
    },
    delegate: void 0,
  };
  var er = (function (e) {
    $(r, e);
    function r(t, n) {
      var o = e.call(this, t, n) || this;
      return (o.scheduler = t), (o.work = n), (o.pending = !1), o;
    }
    return (
      (r.prototype.schedule = function (t, n) {
        var o;
        if ((n === void 0 && (n = 0), this.closed)) return this;
        this.state = t;
        var i = this.id,
          f = this.scheduler;
        return (
          i != null && (this.id = this.recycleAsyncId(f, i, n)),
          (this.pending = !0),
          (this.delay = n),
          (this.id =
            (o = this.id) !== null && o !== void 0
              ? o
              : this.requestAsyncId(f, this.id, n)),
          this
        );
      }),
      (r.prototype.requestAsyncId = function (t, n, o) {
        return (
          o === void 0 && (o = 0), Ve.setInterval(t.flush.bind(t, this), o)
        );
      }),
      (r.prototype.recycleAsyncId = function (t, n, o) {
        if (
          (o === void 0 && (o = 0),
          o != null && this.delay === o && this.pending === !1)
        )
          return n;
        n != null && Ve.clearInterval(n);
      }),
      (r.prototype.execute = function (t, n) {
        if (this.closed) return new Error("executing a cancelled action");
        this.pending = !1;
        var o = this._execute(t, n);
        if (o) return o;
        this.pending === !1 &&
          this.id != null &&
          (this.id = this.recycleAsyncId(this.scheduler, this.id, null));
      }),
      (r.prototype._execute = function (t, n) {
        var o = !1,
          i;
        try {
          this.work(t);
        } catch (f) {
          (o = !0), (i = f || new Error("Scheduled action threw falsy error"));
        }
        if (o) return this.unsubscribe(), i;
      }),
      (r.prototype.unsubscribe = function () {
        if (!this.closed) {
          var t = this,
            n = t.id,
            o = t.scheduler,
            i = o.actions;
          (this.work = this.state = this.scheduler = null),
            (this.pending = !1),
            ue(i, this),
            n != null && (this.id = this.recycleAsyncId(o, n, null)),
            (this.delay = null),
            e.prototype.unsubscribe.call(this);
        }
      }),
      r
    );
  })(st);
  var Lr = (function () {
    function e(r, t) {
      t === void 0 && (t = e.now),
        (this.schedulerActionCtor = r),
        (this.now = t);
    }
    return (
      (e.prototype.schedule = function (r, t, n) {
        return (
          t === void 0 && (t = 0),
          new this.schedulerActionCtor(this, r).schedule(n, t)
        );
      }),
      (e.now = ze.now),
      e
    );
  })();
  var rr = (function (e) {
    $(r, e);
    function r(t, n) {
      n === void 0 && (n = Lr.now);
      var o = e.call(this, t, n) || this;
      return (o.actions = []), (o._active = !1), o;
    }
    return (
      (r.prototype.flush = function (t) {
        var n = this.actions;
        if (this._active) {
          n.push(t);
          return;
        }
        var o;
        this._active = !0;
        do if ((o = t.execute(t.state, t.delay))) break;
        while ((t = n.shift()));
        if (((this._active = !1), o)) {
          for (; (t = n.shift()); ) t.unsubscribe();
          throw o;
        }
      }),
      r
    );
  })(Lr);
  var ge = new rr(er),
    pt = ge;
  var lt = (function (e) {
    $(r, e);
    function r(t, n) {
      var o = e.call(this, t, n) || this;
      return (o.scheduler = t), (o.work = n), o;
    }
    return (
      (r.prototype.requestAsyncId = function (t, n, o) {
        return (
          o === void 0 && (o = 0),
          o !== null && o > 0
            ? e.prototype.requestAsyncId.call(this, t, n, o)
            : (t.actions.push(this),
              t._scheduled ||
                (t._scheduled = Ie.requestAnimationFrame(function () {
                  return t.flush(void 0);
                })))
        );
      }),
      (r.prototype.recycleAsyncId = function (t, n, o) {
        var i;
        if ((o === void 0 && (o = 0), o != null ? o > 0 : this.delay > 0))
          return e.prototype.recycleAsyncId.call(this, t, n, o);
        var f = t.actions;
        n != null &&
          ((i = f[f.length - 1]) === null || i === void 0 ? void 0 : i.id) !==
            n &&
          (Ie.cancelAnimationFrame(n), (t._scheduled = void 0));
      }),
      r
    );
  })(er);
  var mt = (function (e) {
    $(r, e);
    function r() {
      return (e !== null && e.apply(this, arguments)) || this;
    }
    return (
      (r.prototype.flush = function (t) {
        this._active = !0;
        var n = this._scheduled;
        this._scheduled = void 0;
        var o = this.actions,
          i;
        t = t || o.shift();
        do if ((i = t.execute(t.state, t.delay))) break;
        while ((t = o[0]) && t.id === n && o.shift());
        if (((this._active = !1), i)) {
          for (; (t = o[0]) && t.id === n && o.shift(); ) t.unsubscribe();
          throw i;
        }
      }),
      r
    );
  })(rr);
  var Pr = new mt(lt);
  var Ce = new I(function (e) {
    return e.complete();
  });
  function tr(e) {
    return e && O(e.schedule);
  }
  function Rr(e) {
    return e[e.length - 1];
  }
  function Le(e) {
    return O(Rr(e)) ? e.pop() : void 0;
  }
  function oe(e) {
    return tr(Rr(e)) ? e.pop() : void 0;
  }
  function dt(e, r) {
    return typeof Rr(e) == "number" ? e.pop() : r;
  }
  var Pe = function (e) {
    return e && typeof e.length == "number" && typeof e != "function";
  };
  function nr(e) {
    return O(e == null ? void 0 : e.then);
  }
  function or(e) {
    return O(e[Me]);
  }
  function ir(e) {
    return (
      Symbol.asyncIterator && O(e == null ? void 0 : e[Symbol.asyncIterator])
    );
  }
  function ar(e) {
    return new TypeError(
      "You provided " +
        (e !== null && typeof e == "object"
          ? "an invalid object"
          : "'" + e + "'") +
        " where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable."
    );
  }
  function In() {
    return typeof Symbol != "function" || !Symbol.iterator
      ? "@@iterator"
      : Symbol.iterator;
  }
  var fr = In();
  function ur(e) {
    return O(e == null ? void 0 : e[fr]);
  }
  function cr(e) {
    return Br(this, arguments, function () {
      var t, n, o, i;
      return Je(this, function (f) {
        switch (f.label) {
          case 0:
            (t = e.getReader()), (f.label = 1);
          case 1:
            f.trys.push([1, , 9, 10]), (f.label = 2);
          case 2:
            return [4, xe(t.read())];
          case 3:
            return (
              (n = f.sent()),
              (o = n.value),
              (i = n.done),
              i ? [4, xe(void 0)] : [3, 5]
            );
          case 4:
            return [2, f.sent()];
          case 5:
            return [4, xe(o)];
          case 6:
            return [4, f.sent()];
          case 7:
            return f.sent(), [3, 2];
          case 8:
            return [3, 10];
          case 9:
            return t.releaseLock(), [7];
          case 10:
            return [2];
        }
      });
    });
  }
  function sr(e) {
    return O(e == null ? void 0 : e.getReader);
  }
  function H(e) {
    if (e instanceof I) return e;
    if (e != null) {
      if (or(e)) return Cn(e);
      if (Pe(e)) return Ln(e);
      if (nr(e)) return Pn(e);
      if (ir(e)) return ht(e);
      if (ur(e)) return Rn(e);
      if (sr(e)) return Hn(e);
    }
    throw ar(e);
  }
  function Cn(e) {
    return new I(function (r) {
      var t = e[Me]();
      if (O(t.subscribe)) return t.subscribe(r);
      throw new TypeError(
        "Provided object does not correctly implement Symbol.observable"
      );
    });
  }
  function Ln(e) {
    return new I(function (r) {
      for (var t = 0; t < e.length && !r.closed; t++) r.next(e[t]);
      r.complete();
    });
  }
  function Pn(e) {
    return new I(function (r) {
      e.then(
        function (t) {
          r.closed || (r.next(t), r.complete());
        },
        function (t) {
          return r.error(t);
        }
      ).then(null, Be);
    });
  }
  function Rn(e) {
    return new I(function (r) {
      var t, n;
      try {
        for (var o = Y(e), i = o.next(); !i.done; i = o.next()) {
          var f = i.value;
          if ((r.next(f), r.closed)) return;
        }
      } catch (s) {
        t = { error: s };
      } finally {
        try {
          i && !i.done && (n = o.return) && n.call(o);
        } finally {
          if (t) throw t.error;
        }
      }
      r.complete();
    });
  }
  function ht(e) {
    return new I(function (r) {
      kn(e, r).catch(function (t) {
        return r.error(t);
      });
    });
  }
  function Hn(e) {
    return ht(cr(e));
  }
  function kn(e, r) {
    var t, n, o, i;
    return Gr(this, void 0, void 0, function () {
      var f, s;
      return Je(this, function (u) {
        switch (u.label) {
          case 0:
            u.trys.push([0, 5, 6, 11]), (t = Zr(e)), (u.label = 1);
          case 1:
            return [4, t.next()];
          case 2:
            if (((n = u.sent()), !!n.done)) return [3, 4];
            if (((f = n.value), r.next(f), r.closed)) return [2];
            u.label = 3;
          case 3:
            return [3, 1];
          case 4:
            return [3, 11];
          case 5:
            return (s = u.sent()), (o = { error: s }), [3, 11];
          case 6:
            return (
              u.trys.push([6, , 9, 10]),
              n && !n.done && (i = t.return) ? [4, i.call(t)] : [3, 8]
            );
          case 7:
            u.sent(), (u.label = 8);
          case 8:
            return [3, 10];
          case 9:
            if (o) throw o.error;
            return [7];
          case 10:
            return [7];
          case 11:
            return r.complete(), [2];
        }
      });
    });
  }
  function K(e, r, t, n, o) {
    n === void 0 && (n = 0), o === void 0 && (o = !1);
    var i = r.schedule(function () {
      t(), o ? e.add(this.schedule(null, n)) : this.unsubscribe();
    }, n);
    if ((e.add(i), !o)) return i;
  }
  function pr(e, r) {
    return (
      r === void 0 && (r = 0),
      A(function (t, n) {
        t.subscribe(
          L(
            n,
            function (o) {
              return K(
                n,
                e,
                function () {
                  return n.next(o);
                },
                r
              );
            },
            function () {
              return K(
                n,
                e,
                function () {
                  return n.complete();
                },
                r
              );
            },
            function (o) {
              return K(
                n,
                e,
                function () {
                  return n.error(o);
                },
                r
              );
            }
          )
        );
      })
    );
  }
  function lr(e, r) {
    return (
      r === void 0 && (r = 0),
      A(function (t, n) {
        n.add(
          e.schedule(function () {
            return t.subscribe(n);
          }, r)
        );
      })
    );
  }
  function vt(e, r) {
    return H(e).pipe(lr(r), pr(r));
  }
  function xt(e, r) {
    return H(e).pipe(lr(r), pr(r));
  }
  function bt(e, r) {
    return new I(function (t) {
      var n = 0;
      return r.schedule(function () {
        n === e.length
          ? t.complete()
          : (t.next(e[n++]), t.closed || this.schedule());
      });
    });
  }
  function yt(e, r) {
    return new I(function (t) {
      var n;
      return (
        K(t, r, function () {
          (n = e[fr]()),
            K(
              t,
              r,
              function () {
                var o, i, f;
                try {
                  (o = n.next()), (i = o.value), (f = o.done);
                } catch (s) {
                  t.error(s);
                  return;
                }
                f ? t.complete() : t.next(i);
              },
              0,
              !0
            );
        }),
        function () {
          return O(n == null ? void 0 : n.return) && n.return();
        }
      );
    });
  }
  function mr(e, r) {
    if (!e) throw new Error("Iterable cannot be null");
    return new I(function (t) {
      K(t, r, function () {
        var n = e[Symbol.asyncIterator]();
        K(
          t,
          r,
          function () {
            n.next().then(function (o) {
              o.done ? t.complete() : t.next(o.value);
            });
          },
          0,
          !0
        );
      });
    });
  }
  function gt(e, r) {
    return mr(cr(e), r);
  }
  function wt(e, r) {
    if (e != null) {
      if (or(e)) return vt(e, r);
      if (Pe(e)) return bt(e, r);
      if (nr(e)) return xt(e, r);
      if (ir(e)) return mr(e, r);
      if (ur(e)) return yt(e, r);
      if (sr(e)) return gt(e, r);
    }
    throw ar(e);
  }
  function se(e, r) {
    return r ? wt(e, r) : H(e);
  }
  function ie() {
    for (var e = [], r = 0; r < arguments.length; r++) e[r] = arguments[r];
    var t = oe(e);
    return se(e, t);
  }
  function Hr(e, r) {
    var t = O(e)
        ? e
        : function () {
            return e;
          },
      n = function (o) {
        return o.error(t());
      };
    return new I(
      r
        ? function (o) {
            return r.schedule(n, 0, o);
          }
        : n
    );
  }
  function St(e) {
    return e instanceof Date && !isNaN(e);
  }
  function P(e, r) {
    return A(function (t, n) {
      var o = 0;
      t.subscribe(
        L(n, function (i) {
          n.next(e.call(r, i, o++));
        })
      );
    });
  }
  var Fn = Array.isArray;
  function Wn(e, r) {
    return Fn(r) ? e.apply(void 0, z([], W(r))) : e(r);
  }
  function dr(e) {
    return P(function (r) {
      return Wn(e, r);
    });
  }
  var Un = Array.isArray,
    zn = Object.getPrototypeOf,
    Vn = Object.prototype,
    $n = Object.keys;
  function Et(e) {
    if (e.length === 1) {
      var r = e[0];
      if (Un(r)) return { args: r, keys: null };
      if (jn(r)) {
        var t = $n(r);
        return {
          args: t.map(function (n) {
            return r[n];
          }),
          keys: t,
        };
      }
    }
    return { args: e, keys: null };
  }
  function jn(e) {
    return e && typeof e == "object" && zn(e) === Vn;
  }
  function Ot(e, r) {
    return e.reduce(function (t, n, o) {
      return (t[n] = r[o]), t;
    }, {});
  }
  function Re() {
    for (var e = [], r = 0; r < arguments.length; r++) e[r] = arguments[r];
    var t = oe(e),
      n = Le(e),
      o = Et(e),
      i = o.args,
      f = o.keys;
    if (i.length === 0) return se([], t);
    var s = new I(
      Nn(
        i,
        t,
        f
          ? function (u) {
              return Ot(f, u);
            }
          : X
      )
    );
    return n ? s.pipe(dr(n)) : s;
  }
  function Nn(e, r, t) {
    return (
      t === void 0 && (t = X),
      function (n) {
        Tt(
          r,
          function () {
            for (
              var o = e.length,
                i = new Array(o),
                f = o,
                s = o,
                u = function (c) {
                  Tt(
                    r,
                    function () {
                      var p = se(e[c], r),
                        l = !1;
                      p.subscribe(
                        L(
                          n,
                          function (v) {
                            (i[c] = v),
                              l || ((l = !0), s--),
                              s || n.next(t(i.slice()));
                          },
                          function () {
                            --f || n.complete();
                          }
                        )
                      );
                    },
                    n
                  );
                },
                a = 0;
              a < o;
              a++
            )
              u(a);
          },
          n
        );
      }
    );
  }
  function Tt(e, r, t) {
    e ? K(t, e, r) : r();
  }
  function _t(e, r, t, n, o, i, f, s) {
    var u = [],
      a = 0,
      c = 0,
      p = !1,
      l = function () {
        p && !u.length && !a && r.complete();
      },
      v = function (m) {
        return a < n ? d(m) : u.push(m);
      },
      d = function (m) {
        i && r.next(m), a++;
        var x = !1;
        H(t(m, c++)).subscribe(
          L(
            r,
            function (w) {
              o == null || o(w), i ? v(w) : r.next(w);
            },
            function () {
              x = !0;
            },
            void 0,
            function () {
              if (x)
                try {
                  a--;
                  for (
                    var w = function () {
                      var E = u.shift();
                      f
                        ? K(r, f, function () {
                            return d(E);
                          })
                        : d(E);
                    };
                    u.length && a < n;

                  )
                    w();
                  l();
                } catch (E) {
                  r.error(E);
                }
            }
          )
        );
      };
    return (
      e.subscribe(
        L(r, v, function () {
          (p = !0), l();
        })
      ),
      function () {
        s == null || s();
      }
    );
  }
  function we(e, r, t) {
    return (
      t === void 0 && (t = 1 / 0),
      O(r)
        ? we(function (n, o) {
            return P(function (i, f) {
              return r(n, i, o, f);
            })(H(e(n, o)));
          }, t)
        : (typeof r == "number" && (t = r),
          A(function (n, o) {
            return _t(n, o, e, t);
          }))
    );
  }
  function hr(e) {
    return e === void 0 && (e = 1 / 0), we(X, e);
  }
  function At() {
    return hr(1);
  }
  function $e() {
    for (var e = [], r = 0; r < arguments.length; r++) e[r] = arguments[r];
    return At()(se(e, oe(e)));
  }
  function Se(e) {
    return new I(function (r) {
      H(e()).subscribe(r);
    });
  }
  var qn = ["addListener", "removeListener"],
    Dn = ["addEventListener", "removeEventListener"],
    Qn = ["on", "off"];
  function D(e, r, t, n) {
    if ((O(t) && ((n = t), (t = void 0)), n)) return D(e, r, t).pipe(dr(n));
    var o = W(
        Yn(e)
          ? Dn.map(function (s) {
              return function (u) {
                return e[s](r, u, t);
              };
            })
          : Kn(e)
          ? qn.map(Mt(e, r))
          : Jn(e)
          ? Qn.map(Mt(e, r))
          : [],
        2
      ),
      i = o[0],
      f = o[1];
    if (!i && Pe(e))
      return we(function (s) {
        return D(s, r, t);
      })(H(e));
    if (!i) throw new TypeError("Invalid event target");
    return new I(function (s) {
      var u = function () {
        for (var a = [], c = 0; c < arguments.length; c++) a[c] = arguments[c];
        return s.next(1 < a.length ? a : a[0]);
      };
      return (
        i(u),
        function () {
          return f(u);
        }
      );
    });
  }
  function Mt(e, r) {
    return function (t) {
      return function (n) {
        return e[t](r, n);
      };
    };
  }
  function Kn(e) {
    return O(e.addListener) && O(e.removeListener);
  }
  function Jn(e) {
    return O(e.on) && O(e.off);
  }
  function Yn(e) {
    return O(e.addEventListener) && O(e.removeEventListener);
  }
  function vr(e, r, t) {
    e === void 0 && (e = 0), t === void 0 && (t = pt);
    var n = -1;
    return (
      r != null && (tr(r) ? (t = r) : (n = r)),
      new I(function (o) {
        var i = St(e) ? +e - t.now() : e;
        i < 0 && (i = 0);
        var f = 0;
        return t.schedule(function () {
          o.closed ||
            (o.next(f++), 0 <= n ? this.schedule(void 0, n) : o.complete());
        }, i);
      })
    );
  }
  function N() {
    for (var e = [], r = 0; r < arguments.length; r++) e[r] = arguments[r];
    var t = oe(e),
      n = dt(e, 1 / 0),
      o = e;
    return o.length ? (o.length === 1 ? H(o[0]) : hr(n)(se(o, t))) : Ce;
  }
  var je = new I(ce);
  var Xn = Array.isArray;
  function It(e) {
    return e.length === 1 && Xn(e[0]) ? e[0] : e;
  }
  function Ee(e, r) {
    return A(function (t, n) {
      var o = 0;
      t.subscribe(
        L(n, function (i) {
          return e.call(r, i, o++) && n.next(i);
        })
      );
    });
  }
  function Ct() {
    for (var e = [], r = 0; r < arguments.length; r++) e[r] = arguments[r];
    var t = Le(e),
      n = It(e);
    return n.length
      ? new I(function (o) {
          var i = n.map(function () {
              return [];
            }),
            f = n.map(function () {
              return !1;
            });
          o.add(function () {
            i = f = null;
          });
          for (
            var s = function (a) {
                H(n[a]).subscribe(
                  L(
                    o,
                    function (c) {
                      if (
                        (i[a].push(c),
                        i.every(function (l) {
                          return l.length;
                        }))
                      ) {
                        var p = i.map(function (l) {
                          return l.shift();
                        });
                        o.next(t ? t.apply(void 0, z([], W(p))) : p),
                          i.some(function (l, v) {
                            return !l.length && f[v];
                          }) && o.complete();
                      }
                    },
                    function () {
                      (f[a] = !0), !i[a].length && o.complete();
                    }
                  )
                );
              },
              u = 0;
            !o.closed && u < n.length;
            u++
          )
            s(u);
          return function () {
            i = f = null;
          };
        })
      : Ce;
  }
  function Lt(e) {
    return A(function (r, t) {
      var n = !1,
        o = null,
        i = null,
        f = !1,
        s = function () {
          if ((i == null || i.unsubscribe(), (i = null), n)) {
            n = !1;
            var a = o;
            (o = null), t.next(a);
          }
          f && t.complete();
        },
        u = function () {
          (i = null), f && t.complete();
        };
      r.subscribe(
        L(
          t,
          function (a) {
            (n = !0), (o = a), i || H(e(a)).subscribe((i = L(t, s, u)));
          },
          function () {
            (f = !0), (!n || !i || i.closed) && t.complete();
          }
        )
      );
    });
  }
  function kr(e, r) {
    return (
      r === void 0 && (r = ge),
      Lt(function () {
        return vr(e, r);
      })
    );
  }
  function Fr(e, r) {
    return (
      r === void 0 && (r = null),
      (r = r != null ? r : e),
      A(function (t, n) {
        var o = [],
          i = 0;
        t.subscribe(
          L(
            n,
            function (f) {
              var s,
                u,
                a,
                c,
                p = null;
              i++ % r === 0 && o.push([]);
              try {
                for (var l = Y(o), v = l.next(); !v.done; v = l.next()) {
                  var d = v.value;
                  d.push(f),
                    e <= d.length && ((p = p != null ? p : []), p.push(d));
                }
              } catch (w) {
                s = { error: w };
              } finally {
                try {
                  v && !v.done && (u = l.return) && u.call(l);
                } finally {
                  if (s) throw s.error;
                }
              }
              if (p)
                try {
                  for (var m = Y(p), x = m.next(); !x.done; x = m.next()) {
                    var d = x.value;
                    ue(o, d), n.next(d);
                  }
                } catch (w) {
                  a = { error: w };
                } finally {
                  try {
                    x && !x.done && (c = m.return) && c.call(m);
                  } finally {
                    if (a) throw a.error;
                  }
                }
            },
            function () {
              var f, s;
              try {
                for (var u = Y(o), a = u.next(); !a.done; a = u.next()) {
                  var c = a.value;
                  n.next(c);
                }
              } catch (p) {
                f = { error: p };
              } finally {
                try {
                  a && !a.done && (s = u.return) && s.call(u);
                } finally {
                  if (f) throw f.error;
                }
              }
              n.complete();
            },
            void 0,
            function () {
              o = null;
            }
          )
        );
      })
    );
  }
  function Wr(e, r) {
    return (
      r === void 0 && (r = ge),
      A(function (t, n) {
        var o = null,
          i = null,
          f = null,
          s = function () {
            if (o) {
              o.unsubscribe(), (o = null);
              var a = i;
              (i = null), n.next(a);
            }
          };
        function u() {
          var a = f + e,
            c = r.now();
          if (c < a) {
            (o = this.schedule(void 0, a - c)), n.add(o);
            return;
          }
          s();
        }
        t.subscribe(
          L(
            n,
            function (a) {
              (i = a), (f = r.now()), o || ((o = r.schedule(u, e)), n.add(o));
            },
            function () {
              s(), n.complete();
            },
            void 0,
            function () {
              i = o = null;
            }
          )
        );
      })
    );
  }
  function He(e) {
    return e <= 0
      ? function () {
          return Ce;
        }
      : A(function (r, t) {
          var n = 0;
          r.subscribe(
            L(t, function (o) {
              ++n <= e && (t.next(o), e <= n && t.complete());
            })
          );
        });
  }
  function Pt() {
    return A(function (e, r) {
      e.subscribe(L(r, ce));
    });
  }
  function Rt(e) {
    return P(function () {
      return e;
    });
  }
  function Ur(e, r) {
    return r
      ? function (t) {
          return $e(r.pipe(He(1), Pt()), t.pipe(Ur(e)));
        }
      : we(function (t, n) {
          return H(e(t, n)).pipe(He(1), Rt(t));
        });
  }
  function zr(e, r) {
    r === void 0 && (r = ge);
    var t = vr(e, r);
    return Ur(function () {
      return t;
    });
  }
  function pe(e, r) {
    return (
      r === void 0 && (r = X),
      (e = e != null ? e : Gn),
      A(function (t, n) {
        var o,
          i = !0;
        t.subscribe(
          L(n, function (f) {
            var s = r(f);
            (i || !e(o, s)) && ((i = !1), (o = s), n.next(f));
          })
        );
      })
    );
  }
  function Gn(e, r) {
    return e === r;
  }
  function xr(e, r) {
    return pe(function (t, n) {
      return r ? r(t[e], n[e]) : t[e] === n[e];
    });
  }
  function le(e) {
    return A(function (r, t) {
      try {
        r.subscribe(t);
      } finally {
        t.add(e);
      }
    });
  }
  function Ht(e) {
    e === void 0 && (e = {});
    var r = e.connector,
      t =
        r === void 0
          ? function () {
              return new B();
            }
          : r,
      n = e.resetOnError,
      o = n === void 0 ? !0 : n,
      i = e.resetOnComplete,
      f = i === void 0 ? !0 : i,
      s = e.resetOnRefCountZero,
      u = s === void 0 ? !0 : s;
    return function (a) {
      var c,
        p,
        l,
        v = 0,
        d = !1,
        m = !1,
        x = function () {
          p == null || p.unsubscribe(), (p = void 0);
        },
        w = function () {
          x(), (c = l = void 0), (d = m = !1);
        },
        E = function () {
          var R = c;
          w(), R == null || R.unsubscribe();
        };
      return A(function (R, h) {
        v++, !m && !d && x();
        var b = (l = l != null ? l : t());
        h.add(function () {
          v--, v === 0 && !m && !d && (p = Vr(E, u));
        }),
          b.subscribe(h),
          !c &&
            v > 0 &&
            ((c = new ye({
              next: function (S) {
                return b.next(S);
              },
              error: function (S) {
                (m = !0), x(), (p = Vr(w, o, S)), b.error(S);
              },
              complete: function () {
                (d = !0), x(), (p = Vr(w, f)), b.complete();
              },
            })),
            H(R).subscribe(c));
      })(a);
    };
  }
  function Vr(e, r) {
    for (var t = [], n = 2; n < arguments.length; n++) t[n - 2] = arguments[n];
    if (r === !0) {
      e();
      return;
    }
    if (r !== !1) {
      var o = new ye({
        next: function () {
          o.unsubscribe(), e();
        },
      });
      return H(r.apply(void 0, z([], W(t)))).subscribe(o);
    }
  }
  function me(e, r, t) {
    var n,
      o,
      i,
      f,
      s = !1;
    return (
      e && typeof e == "object"
        ? ((n = e.bufferSize),
          (f = n === void 0 ? 1 / 0 : n),
          (o = e.windowTime),
          (r = o === void 0 ? 1 / 0 : o),
          (i = e.refCount),
          (s = i === void 0 ? !1 : i),
          (t = e.scheduler))
        : (f = e != null ? e : 1 / 0),
      Ht({
        connector: function () {
          return new ct(f, r, t);
        },
        resetOnError: !0,
        resetOnComplete: !1,
        resetOnRefCountZero: s,
      })
    );
  }
  function he() {
    for (var e = [], r = 0; r < arguments.length; r++) e[r] = arguments[r];
    var t = oe(e);
    return A(function (n, o) {
      (t ? $e(e, n, t) : $e(e, n)).subscribe(o);
    });
  }
  function Q(e, r) {
    return A(function (t, n) {
      var o = null,
        i = 0,
        f = !1,
        s = function () {
          return f && !o && n.complete();
        };
      t.subscribe(
        L(
          n,
          function (u) {
            o == null || o.unsubscribe();
            var a = 0,
              c = i++;
            H(e(u, c)).subscribe(
              (o = L(
                n,
                function (p) {
                  return n.next(r ? r(u, p, c, a++) : p);
                },
                function () {
                  (o = null), s();
                }
              ))
            );
          },
          function () {
            (f = !0), s();
          }
        )
      );
    });
  }
  function ke(e, r, t) {
    var n = O(e) || r || t ? { next: e, error: r, complete: t } : e;
    return n
      ? A(function (o, i) {
          var f;
          (f = n.subscribe) === null || f === void 0 || f.call(n);
          var s = !0;
          o.subscribe(
            L(
              i,
              function (u) {
                var a;
                (a = n.next) === null || a === void 0 || a.call(n, u),
                  i.next(u);
              },
              function () {
                var u;
                (s = !1),
                  (u = n.complete) === null || u === void 0 || u.call(n),
                  i.complete();
              },
              function (u) {
                var a;
                (s = !1),
                  (a = n.error) === null || a === void 0 || a.call(n, u),
                  i.error(u);
              },
              function () {
                var u, a;
                s &&
                  ((u = n.unsubscribe) === null || u === void 0 || u.call(n)),
                  (a = n.finalize) === null || a === void 0 || a.call(n);
              }
            )
          );
        })
      : X;
  }
  function Fe() {
    for (var e = [], r = 0; r < arguments.length; r++) e[r] = arguments[r];
    var t = Le(e);
    return A(function (n, o) {
      for (
        var i = e.length,
          f = new Array(i),
          s = e.map(function () {
            return !1;
          }),
          u = !1,
          a = function (p) {
            H(e[p]).subscribe(
              L(
                o,
                function (l) {
                  (f[p] = l),
                    !u &&
                      !s[p] &&
                      ((s[p] = !0), (u = s.every(X)) && (s = null));
                },
                ce
              )
            );
          },
          c = 0;
        c < i;
        c++
      )
        a(c);
      n.subscribe(
        L(o, function (p) {
          if (u) {
            var l = z([p], W(f));
            o.next(t ? t.apply(void 0, z([], W(l))) : l);
          }
        })
      );
    });
  }
  function kt() {
    for (var e = [], r = 0; r < arguments.length; r++) e[r] = arguments[r];
    return A(function (t, n) {
      Ct.apply(void 0, z([t], W(e))).subscribe(n);
    });
  }
  function $r() {
    for (var e = [], r = 0; r < arguments.length; r++) e[r] = arguments[r];
    return kt.apply(void 0, z([], W(e)));
  }
  function Ft(e, r = document) {
    return Array.from(r.querySelectorAll(e));
  }
  function Z(e, r = document) {
    let t = Wt(e, r);
    if (typeof t == "undefined")
      throw new ReferenceError(
        `Missing element: expected "${e}" to be present`
      );
    return t;
  }
  function Wt(e, r = document) {
    return r.querySelector(e) || void 0;
  }
  function jr() {
    var e, r, t, n;
    return (n =
      (t =
        (r = (e = document.activeElement) == null ? void 0 : e.shadowRoot) ==
        null
          ? void 0
          : r.activeElement) != null
        ? t
        : document.activeElement) != null
      ? n
      : void 0;
  }
  var Bn = N(D(document.body, "focusin"), D(document.body, "focusout")).pipe(
    Wr(1),
    he(void 0),
    P(() => jr() || document.body),
    me(1)
  );
  function Ut(e) {
    return Bn.pipe(
      P((r) => e.contains(r)),
      pe()
    );
  }
  function zt(e, r) {
    if (typeof r == "string" || typeof r == "number")
      e.innerHTML += r.toString();
    else if (r instanceof Node) e.appendChild(r);
    else if (Array.isArray(r)) for (let t of r) zt(e, t);
  }
  function J(e, r, ...t) {
    let n = document.createElement(e);
    if (r)
      for (let o of Object.keys(r))
        typeof r[o] != "undefined" &&
          (typeof r[o] != "boolean"
            ? n.setAttribute(o, r[o])
            : n.setAttribute(o, ""));
    for (let o of t) zt(n, o);
    return n;
  }
  function Vt(e) {
    if (e > 999) {
      let r = +((e - 950) % 1e3 > 99);
      return `${((e + 1e-6) / 1e3).toFixed(r)}k`;
    } else return e.toString();
  }
  function $t(e) {
    let r = J("script", { src: e });
    return Se(
      () => (
        document.head.appendChild(r),
        N(
          D(r, "load"),
          D(r, "error").pipe(
            Q(() => Hr(() => new ReferenceError(`Invalid script: ${e}`)))
          )
        ).pipe(
          P(() => {}),
          le(() => document.head.removeChild(r)),
          He(1)
        )
      )
    );
  }
  var Zn = new B(),
    xp = Se(() =>
      typeof ResizeObserver == "undefined"
        ? $t("https://unpkg.com/resize-observer-polyfill")
        : ie(void 0)
    ).pipe(
      P(() => new ResizeObserver((e) => e.forEach((r) => Zn.next(r)))),
      Q((e) => N(je, ie(e)).pipe(le(() => e.disconnect()))),
      me(1)
    );
  function jt(e) {
    return { width: e.offsetWidth, height: e.offsetHeight };
  }
  function Nt(e) {
    return { width: e.scrollWidth, height: e.scrollHeight };
  }
  function qt(e) {
    return { x: e.scrollLeft, y: e.scrollTop };
  }
  function Dt(e) {
    return N(D(e, "scroll"), D(window, "scroll"), D(window, "resize")).pipe(
      kr(0, Pr),
      P(() => qt(e)),
      he(qt(e))
    );
  }
  var eo = new B(),
    kp = Se(() =>
      ie(
        new IntersectionObserver(
          (e) => {
            for (let r of e) eo.next(r);
          },
          { threshold: 0 }
        )
      )
    ).pipe(
      Q((e) => N(je, ie(e)).pipe(le(() => e.disconnect()))),
      me(1)
    );
  function Qt(e, r = 16) {
    return Dt(e).pipe(
      P(({ y: t }) => {
        let n = jt(e),
          o = Nt(e);
        return t >= o.height - n.height - r;
      }),
      pe()
    );
  }
  var Dp = {
    drawer: Z("[data-md-toggle=drawer]"),
    search: Z("[data-md-toggle=search]"),
  };
  var ro = Z("#__config"),
    Ne = JSON.parse(ro.textContent);
  Ne.base = `${new URL(Ne.base, Yt())}`;
  function Kt() {
    return Ne;
  }
  function Jt(e, r) {
    return typeof r != "undefined"
      ? Ne.translations[e].replace("#", r.toString())
      : Ne.translations[e];
  }
  function Yt() {
    return new URL(location.href);
  }
  function to(e, r) {
    return new I((t) => {
      let n = new XMLHttpRequest();
      return (
        n.open("GET", `${e}`),
        (n.responseType = "blob"),
        n.addEventListener("load", () => {
          n.status >= 200 && n.status < 300
            ? (t.next(n.response), t.complete())
            : t.error(new Error(n.statusText));
        }),
        n.addEventListener("error", () => {
          t.error(new Error("Network error"));
        }),
        n.addEventListener("abort", () => {
          t.complete();
        }),
        typeof (r == null ? void 0 : r.progress$) != "undefined" &&
          (n.addEventListener("progress", (o) => {
            var i;
            if (o.lengthComputable)
              r.progress$.next((o.loaded / o.total) * 100);
            else {
              let f =
                (i = n.getResponseHeader("Content-Length")) != null ? i : 0;
              r.progress$.next((o.loaded / +f) * 100);
            }
          }),
          r.progress$.next(5)),
        n.send(),
        () => n.abort()
      );
    });
  }
  function br(e, r) {
    return to(e, r).pipe(
      Q((t) => t.text()),
      P((t) => JSON.parse(t)),
      me(1)
    );
  }
  function We(e, r = document) {
    return Z(`[data-mdx-component=${e}]`, r);
  }
  function Nr(e, r = document) {
    return Ft(`[data-mdx-component=${e}]`, r);
  }
  function Xt(e) {
    let r = Ut(e),
      t = N(D(e, "keyup"), D(e, "focus").pipe(zr(1))).pipe(
        P(() => e.value),
        he(e.value),
        pe()
      );
    return (
      r
        .pipe(
          Ee((n) => !n),
          Fe(t)
        )
        .subscribe(([, n]) => {
          let o = document.location.pathname;
          typeof ga == "function" &&
            n.length &&
            ga("send", "pageview", `${o}?q=[icon]+${n}`);
        }),
      Re([t, r]).pipe(P(([n, o]) => ({ ref: e, value: n, focus: o })))
    );
  }
  var Qr = Xr(Dr());
  var fn = Xr(Dr());
  function an(e, r) {
    return (0, fn.wrap)(e.shortcode, r, {
      wrap: { tagOpen: "<b>", tagClose: "</b>" },
    });
  }
  function un(e, r, t) {
    return J(
      "li",
      { class: "mdx-iconsearch-result__item" },
      J("span", { class: "twemoji" }, J("img", { src: e.url })),
      J(
        "button",
        {
          class: "md-clipboard--inline",
          title: Jt("clipboard.copy"),
          "data-clipboard-text": t ? e.shortcode : `:${e.shortcode}:`,
        },
        J("code", null, t ? an(e, r) : `:${an(e, r)}:`)
      )
    );
  }
  function cn(e) {
    let r = `@${e.name}`;
    return J(
      "a",
      { href: e.url, title: r, class: "mdx-sponsorship__item" },
      J("img", { src: e.image })
    );
  }
  function sn(e) {
    return J(
      "a",
      {
        href: "https://github.com/sponsors/squidfunk?metadata_origin=docs",
        class: "mdx-sponsorship__item mdx-sponsorship__item--private",
      },
      "+",
      e
    );
  }
  function no(e, { index$: r, query$: t }) {
    switch (e.getAttribute("data-mdx-mode")) {
      case "file":
        return Re([
          t.pipe(xr("value")),
          r.pipe(
            P(({ icons: n }) =>
              Object.values(n.data).map((o) => o.replace(/\.svg$/, ""))
            )
          ),
        ]).pipe(
          P(([{ value: n }, o]) => (0, Qr.filter)(o, n)),
          Q((n) =>
            r.pipe(
              P(({ icons: o }) => ({
                data: n.map((i) => ({
                  shortcode: i,
                  url: [o.base, i, ".svg"].join(""),
                })),
              }))
            )
          )
        );
      default:
        return Re([
          t.pipe(xr("value")),
          r.pipe(
            P(({ icons: n, emojis: o }) => [
              ...Object.keys(n.data),
              ...Object.keys(o.data),
            ])
          ),
        ]).pipe(
          P(([{ value: n }, o]) => (0, Qr.filter)(o, n)),
          Q((n) =>
            r.pipe(
              P(({ icons: o, emojis: i }) => ({
                data: n.map((f) => {
                  let s = f in o.data ? o : i;
                  return { shortcode: f, url: [s.base, s.data[f]].join("") };
                }),
              }))
            )
          )
        );
    }
  }
  function pn(e, { index$: r, query$: t }) {
    let n = new B(),
      o = Qt(e).pipe(Ee(Boolean)),
      i = Z(":scope > :first-child", e);
    n.pipe(Fe(t)).subscribe(([{ data: u }, { value: a }]) => {
      if (a)
        switch (u.length) {
          case 0:
            i.textContent = "No matches";
            break;
          case 1:
            i.textContent = "1 match";
            break;
          default:
            i.textContent = `${Vt(u.length)} matches`;
        }
      else i.textContent = "Type to start searching";
    });
    let f = e.getAttribute("data-mdx-mode") === "file",
      s = Z(":scope > :last-child", e);
    return (
      n
        .pipe(
          ke(() => (s.innerHTML = "")),
          Q(({ data: u }) =>
            N(
              ie(...u.slice(0, 10)),
              ie(...u.slice(10)).pipe(
                Fr(10),
                $r(o),
                Q(([a]) => a)
              )
            )
          ),
          Fe(t)
        )
        .subscribe(([u, { value: a }]) => s.appendChild(un(u, a, f))),
      no(e, { query$: t, index$: r }).pipe(
        ke((u) => n.next(u)),
        le(() => n.complete()),
        P((u) => Ke({ ref: e }, u))
      )
    );
  }
  function ln(e) {
    let r = Kt(),
      t = br(new URL("assets/javascripts/iconsearch_index.json", r.base)),
      n = We("iconsearch-query", e),
      o = We("iconsearch-result", e),
      i = Xt(n),
      f = pn(o, { index$: t, query$: i });
    return N(i, f);
  }
  function mn(e) {
    let r = br("https://3if8u9o552.execute-api.us-east-1.amazonaws.com/_/"),
      t = We("sponsorship-count"),
      n = We("sponsorship-total");
    return (
      r.subscribe((o) => {
        e.removeAttribute("hidden");
        let i = Z(":scope > :first-child", e);
        for (let f of o.sponsors)
          f.type === "public" && i.appendChild(cn(f.user));
        i.appendChild(
          sn(o.sponsors.filter(({ type: f }) => f === "private").length)
        ),
          (t.innerText = `${o.sponsors.length}`),
          (n.innerText = `$ ${o.total
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")} a month`);
      }),
      r.pipe(P((o) => Ke({ ref: e }, o)))
    );
  }
  function dn() {
    let { origin: e } = new URL(location.href);
    D(document.body, "click").subscribe((r) => {
      if (r.target instanceof HTMLElement) {
        let t = r.target.closest("a");
        t &&
          t.origin !== e &&
          ga("send", "event", "outbound", "click", t.href);
      }
    });
  }
  dn();
  var oo = document$.pipe(
    Q(() =>
      N(
        ...Nr("iconsearch").map((e) => ln(e)),
        ...Nr("sponsorship").map((e) => mn(e))
      )
    )
  );
  oo.subscribe();
})();
//# sourceMappingURL=custom.e2e97759.min.js.map
