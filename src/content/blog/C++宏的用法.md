---
title: "关于 C++ 宏的一些用法"
date: 2023-01-06
# weight: 1
# 网址优化
slug: "37or0k6"
# 标签
tags: ["Code", "C++", "笔记"]
# 作者
author: "Ticks"
description: ""
# 显示目录
toc: true
# 目录显示数字
tocNum: true
# 支持katex
katex: false
# 开启评论
comments: false
# 文章过期时间
# expiryDate: 
# 文章最后更新时间
# lastMod: ""
---


## 了解

**宏是C++支持的一种语言特性，可以让我们在编译器预处理阶段对源代码进行一些替换。**

### 概念

C++中使用 **`#define`** 定义一个宏，使用 **`#undef`** 取消一个宏定义，C++提供了两类宏，一种 **object-like** 宏，一种 **function-like** 宏，基本用法如下：

```cpp
// object-like
#define MAX_COUNT 10

MAX_COUNT 
=> 10

// function-like
#define ADD(a, b) a + b

ADD(1, 2)
=> 1 + 2
```

如果在同一作用域内定义了两个完全一致的宏名（如果为 **function-like** 宏，则参数列表也应一致），但是替换列表却不相同，ISO 规定这是不正确的，不过不同编译器对于这种情况处理不同，可能会以最后定义的进行替换，也可能直接报错。

**一个宏定义只能定义在一行内，以换行符结尾** ，如果内容太多，需要在多行定义，则需要在每行最后使用 `\` 进行换行转义！

对于 **object-like** 宏，宏作用只是在作用域内将源代码中符合宏名的源代码进行替换，比如上面的 `MAX_COUNT` 替换为 `10` ，如果需要根据不同的参数进行某种模式的替换，就需要使用 **function-like** 宏，比如上面 `ADD` 宏将宏中与宏参数一致的部分进行替换。一个标准的宏定义如下：

```cpp
// object-like 宏
#define 宏名 替换列表 换行符
// function-like 宏
#define 宏名([参数列表]) 替换列表 换行符
```

其中 **参数列表** 和 **替换列表** 都是将字符串 **`token`** 化后的列表，一个 `token`  可以看作编译原理中语法标记或者语法符号，一般由 `token名` 和 一些 `属性` 组成，，比如数字 1 可以认为是一个整数常量，`token` 名为 `const-integer` ，属性值为 `1`  ，`int` 可以看作一个标识符，`token` 名为 `identifier` ，属性值为 `int` 。宏在处理时，是按照 `token` 进行处理，而不是字符串形式进行处理，在 `token` 化中，空白符主要用于分割，所以多余的空格符对于宏来说是没有意义的，比如：

```cpp
#define MAX_COUNT           10

MAX_COUNT
=> 10
```

### 宏操作

C++ 宏有几个主要操作，分别为 **`#`** （token字符串化） 和 **`##`** （token连接）。

将 **function-like** 宏参数字符串化，可以使用 `#` ，例如：

```cpp
#define LOGW(err) fprintf(stderr, "Warning" #err "\n")

LOGW(This is a warn logmsg)
=> fprintf(stderr, "Warning" "This is a warn logmsg" "\n")
// 最后因为字符串合并为：fprintf(stderr, "WarningThis is a warn logmsg\n")
```

**注意：**

1. `#` 操作符不只是简单的添加双引号，还会自动对特殊字符转义（就算参数使用双引号，也会被自动转义）。
2. `#` 操作符只能对 **function-like** 宏参数使用。
3. 由于参数会被 `token` 化，前后多余空格会被压缩成一个。
4. **function-like** 宏参数使用 `,` 分隔，所以上面例子中参数不能出现 `,` 。

如果要将两个 `token` 合并为一个，则 `##` 将派上用场，利用 `##` ，可以动态生成名称或者函数，比如：

```cpp
#define CUSTOM_FUNC_NAME(T, N) _$_## T ##_## N ##_custom_func$_

#define GETTER(T, N) T get_##N (){ return this->N; }

CUSTOM_FUNC_NAME(int, func1)
=> _$_int_func1_custom_func$_

GETTER(int, _num)
=> int get__num(){ return this->_num; }
```

**function-like** 宏支持可变参数（参数列表数量不固定），在参数列表指定 **`...`** ，要在替换列表中使用可变参数可以使用 **`__VA_ARGS__`** ，遗憾的是，宏不支持直接访问其中某个指定参数。

```cpp
#define ARGS(...) __VA_ARGS__

ARGS(123 456 789, 123)
=> 123 456 789, 123

#define ARGS_1(n, ...) n = __VA_ARGS__

ARGS_1(5, 1,2,3,4,5)
=> 5 = 1,2,3,4,5
```

注意：**类函数宏支持不定参数，不过可变参数只能出现在参数列表最后！**

## 深入

上一节了解了宏的基本用法，这一节深入理解宏的展开过程。

### object-like 宏的展开

如果替换列表中出现定义的宏，会递归展开，并且是深度优先的递归，比如：

```cpp
#define a 12
#define b 6
#define c a
#define d b c

d
=> b c
=> 6 c
=> 6 a
=> 6 12
```

由于是深度优先的，所以只有前一个宏完全展开后，下一个宏才能展开，递归必须能终止，所以对于下面这种可能出现 **无限递归** 的情况，必须进行阻止！

```cpp
#define a b
#define b a

b
=> a
=> b
=> ?
```

在宏展开过程中，如果遇到任何已展开的宏，那么会跳过该宏的展开。这很好理解，相当于每次递归展开时，维护一个已展开宏列表，这里我称为 **标记列表** ，这个标记列表由父级标记列表加上当前展开宏构成 ，每次展开前观察宏是否已标记，如果没有被标记，则进行展开，并将当前展开宏进行标记，如果待展开宏已被标记，则跳过展开。

下面代码展示了宏 x 的展开过程：

```
#define x x a y b z c
#define y x aa
#define z y bb

// 方括号为标记列表，展示x展开过程
x                       [] -> 展开x
=> x a y b z c          [x] -> 展开 y
=> x a x aa b z c       [x, y] -> y展开完毕，递归返回
=> x a x aa b z c       [x] -> y展开递归返回后，上一层y并没有被标记，继续向后展开z
=> x a x aa b y bb c    [x, z] -> 继续展开 y
=> x a x aa b x aa bb c [x, z, y] -> z递归展开完成，返回后没有需要展开的了，x宏展开完成
```

### function-like 宏的展开

类函数宏的展开与类对象宏展开思路是一致的，不过在其基础上增加了参数列表和部分新的规则。大致展开规则如下：

1. 会先 **完全展开** 参数列表，如果宏替换列表中被 **`#`** 、**`##`** 调用，则该参数不会被展开！
2. 使用展开后参数内容替换替换列表中内容。
3. 会重新扫描新的替换列表，进一步展开宏内容。
4. 每次替换仍然遵循 **object-like** 宏的标记列表规则，防止无限递归。
5. 使用 **function-like** 宏时，如果宏名后没有跟括号，则不将其视为宏。
6. 每次展开完成会向后看一个 `token` ，如果与展开的宏能构成新的宏，则继续进行展开。

对于第3点，下面例子可以体现：

```cpp
#define FOO_1 120
#define CAT(x, y) x ## y

CAT(FOO_, 1)
=> FOO_1 // 展开完成后对替换列表进行一次扫描，FOO_1，继续展开
=> 120
```

对于第6点，下面例子可以体现：

```cpp
#define CAT(x, y) x ## y
#define CAT_1(x, y) x ## y 120

CAT(CAT_, 1)(app, le)
=> CAT_1(app, le) // 展开完成，向后看一个 token，与新列表组成新的宏，继续展开
=> apple 120
```

下面的例子可以帮助理解 **自指类函数宏** 的展开过程：

```cpp
#define FOO_(x) FOO_1(x)
#define FOO_1(x) FOO_2(x) + 1
#define FOO_2(x) FOO_1(x) - 1
#define TEST(x) FOO_ ## x (12) FOO_2

TEST(1)(5)
=> FOO_1(12) FOO_2(5) // []
=> FOO_2(12) + 1 FOO_2(5) // [FOO_1]
=> FOO_1(12) - 1 + 1 FOO_2(5) // [FOO_1, FOO_2], 无法再递归，返回到顶部 -> []
=> FOO_1(12) - 1 + 1 FOO_1(5) - 1 // [FOO_2]
=> FOO_1(12) - 1 + 1 FOO_2(5) + 1 - 1 // [FOO_2, FOO_1]
```

经过上面的介绍，现在看到一个陌生的宏，应该不会太过惊讶了，实在太复杂就拿出画图工具挨个解析一遍就清楚展开步骤了。

## 宏的惯用用法

### 1. 连接宏

从上面 **function-like** 宏可以了解到，如果宏替换中使用了 **`#`** ，则不会对宏参数进行展开，所以一般我们都需要额外包装一层宏，来确保参数可以是另外一个宏，并能对其进行展开：

```cpp
// 用于最后连接
#define __MACRO_CAT(X, Y) X ## Y
// 替换列表没有使用 # ，会先对参数进行展开
#define MACRO_CAT(X, Y) __MACRO(X, Y)
-------------------------------------------
#define A 你是
#define B 250
MACRO_CAT(A, B)
=> MACRO_CAT(我是，250)
=> __MACRO_CAT(我是， 250)
=> 我是250
```

### 2. 模式匹配宏

用过C++的都知道C++中有分支控制 **`if`** 和 **`switch`** ，其实宏也能实现类似功能，这就需要利用 **连接宏** 和一些额外的分支宏来实现：

```cpp
// 利用连接宏将c展开为对应分支
#define MACRO_IF(c) MACRO_CAT(__MACRO_IF_, c)
// 失败分支， 利用可变参数忽略第一个成功分支
#define __MACRO_IF_0(t, ...) __VA_ARGS__
// 成功分支，直接执行第一个分支，忽略失败分支
#define __MACRO_IF_1(t, ...) t

#define A() std::cout << "I am true\n";
#define B() std::cout << "I am false\n";
------------------------------------------------
MACRO_IF(1)(\
    A(),\
    B()\
)
=> __MACRO_IF_1(A(), B())
=> std::cout << "I am true\n";
```

现在这个宏还比较简陋，只有 `c` 为 `1` 或者 `0` 时才有效。

当然利用这种方式也能实现 **`取反`** ：

```cpp
#define MACRO_NOT(c) MACRO_CAT(__MACRO_NOT_, c)
#define __MACRO_NOT_1 0
#define __MACRO_NOT_0 1很
```

很多开源库里面使用的 XXX 也算是一种模式匹配宏，比如最常见的HTTP状态码：

```cpp
#define HTTP_STATUSCODE_MAP(XX)            \
    XX(HTTP_OK,       "Success",   200)    \
    XX(HTTP_NOTFOUND, "Not Found", 404)    \
    XX(HTTP_ERROR,    "Server Error", 501) \
...

template <typename T>
class A{  
};

#define XX(enum, msg, code) enum,
enum HttpCode
{
    HTTP_STATUSCODE_MAP(XX)
};
#undef XX

const char* getHttpCodeMsg(HttpCode code)
{
    #define XX(enum, msg, code) case enum: return msg;
    switch(code) {
        HTTP_STATUSCODE_MAP(XX)
        default: return "";
    }
    #undef XX
}
int getHttpCode(HttpCode code)
{
    #define XX(enum, msg, code) case enum: return code;
    switch(code) {
        HTTP_STATUSCODE_MAP(XX)
        default: return 0;
    }
    #undef XX
}
```

---

后续待补充. . .
