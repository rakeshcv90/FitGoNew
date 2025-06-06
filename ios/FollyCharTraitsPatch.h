#pragma once
#include <string>

namespace std {
  template <>
  struct char_traits<unsigned char> {
    using char_type = unsigned char;
    using int_type = int;

    static void assign(char_type& r, const char_type& c) { r = c; }
    static bool eq(const char_type& a, const char_type& b) { return a == b; }
    static bool lt(const char_type& a, const char_type& b) { return a < b; }
    static int compare(const char_type* s1, const char_type* s2, size_t n) {
      for (size_t i = 0; i < n; ++i) {
        if (!eq(s1[i], s2[i])) return lt(s1[i], s2[i]) ? -1 : 1;
      }
      return 0;
    }
    static size_t length(const char_type* s) {
      size_t i = 0;
      while (s[i] != 0) ++i;
      return i;
    }
    static const char_type* find(const char_type* s, size_t n, const char_type& a) {
      for (size_t i = 0; i < n; ++i) {
        if (eq(s[i], a)) return s + i;
      }
      return nullptr;
    }
    static char_type* move(char_type* s1, const char_type* s2, size_t n) {
      return static_cast<char_type*>(memmove(s1, s2, n));
    }
    static char_type* copy(char_type* s1, const char_type* s2, size_t n) {
      return static_cast<char_type*>(memcpy(s1, s2, n));
    }
    static char_type* assign(char_type* s, size_t n, char_type a) {
      return static_cast<char_type*>(memset(s, a, n));
    }
    static int_type eof() { return -1; }
    static int_type to_int_type(const char_type& c) { return c; }
    static char_type to_char_type(const int_type& c) { return static_cast<char_type>(c); }
    static bool eq_int_type(const int_type& a, const int_type& b) { return a == b; }
    static int_type not_eof(const int_type& c) { return c == eof() ? 0 : c; }
  };
}
