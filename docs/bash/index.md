## Shell Programming

    No programming language is perfect. There is not even a single best language; there are only languages well suited or perhaps poorly suited for particular purposes. --- Herbert Mayer

!!! note "When NOT to use shell scripts"

    - Resource-intensive tasks, especially where speed is a factor (sorting,
    hashing, recursion ...)
    - Procedures involving heavy-duty math operations, especially floating point
    arithmetic, arbitrary precision calculations, or complex numbers (use C++ or
    FORTRAN instead)
    - Cross-platform portability required (use C or Java instead)
    - Complex applications, where structured programming is a necessity
    (type-checking of variables, function prototypes, etc.)
    - Mission-critical applications upon which you are betting the future of the
    company
    - Situations where security is important, where you need to guarantee the
    integrity of your system and protect against intrusion, cracking, and
    vandalism
    - Project consists of subcomponents with interlocking dependencies
    - Extensive file operations required (Bash is limited to serial file access,
    and that only in a particularly clumsy and inefficient line-by-line fashion.)
    - Need native support for multi-dimensional arrays
    - Need data structures, such as linked lists or trees
    - Need to generate / manipulate graphics or GUIs
    - Need direct access to system hardware
    - Need port or socket I/O
    - Need to use libraries or interface with legacy code
    - Proprietary, closed-source applications (Shell scripts put the source code
    right out in the open for all the world to see.)

In the simplest case, a script is nothing more than a list of system commands
stored in a file. At the very least, this saves the effort of retyping that
particular sequence of commands each time it is invoked.

!!! note "Example 2-1. Cleanup: A script to clean up the log files in /var/log"

    ```bash linenums="1"
    # Cleanup
    # Run as root, of course.
    cd /var/log
    cat /dev/null > messages
    cat /dev/null > wtmp
    echo "Logs cleaned up."
    ```

The most important thing for developers is to avoid duplicated work by reusing
code. Therefore, developers often use variables to replace literals and
functions to replace code blocks.

!!! note "Example 2-2. Cleanup: An improved clean-up script"

    ```bash linenums="1"
    #!/bin/bash
    # Proper header for a Bash script.
    # Cleanup, version 2
    # Run as root, of course.
    # Insert code here to print error message and exit if not root.
    LOG_DIR=/var/log
    # Variables are better than hard-coded values.
    cd $LOG_DIR
    cat /dev/null > messages
    cat /dev/null > wtmp
    echo "Logs cleaned up."
    exit # The right and proper method of "exiting" from a script.
    ```

One of the good practices for coding is to validate the input and permissions
of the program. When we put commands in a shell script and make the shell
script executable, the shell script becomes a program.

!!! note "Example 2-3. Cleanup: An enhanced and generalized version."

    ```bash linenums="1"
    #!/bin/bash
    # Cleanup, version 3

    LOG_DIR=/var/log
    ROOT_UID=0 # Only users with $UID 0 have root privileges.
    LINES=50 # Default number of lines saved.
    E_XCD=86 # Can't change directory?
    E_NOTROOT=87 # Non-root exit error.
    # Run as root, of course. Otherwise, print helpful message and exit.
    if [ "$UID" -ne "$ROOT_UID" ]
    then
        echo "Must be root to run this script."
        exit $E_NOTROOT
    fi

    if [ -n "$1" ]
    # Test whether command-line argument is present (non-empty).
    then
        lines=$1
    else
        lines=$LINES # Default, if not specified on command-line.
    fi
    # Stephane Chazelas suggests the following,
    #+ as a better way of checking command-line arguments,
    #+ but this is still a bit advanced for this stage of the tutorial.
    #
    # E_WRONGARGS=85 # Non-numerical argument (bad argument format).
    #
    # case "$1" in
    # "" ) lines=50;;
    # *[!0-9]*) echo "Usage: `basename $0` file-to-cleanup"; exit $E_WRONGARGS;;
    # * ) lines=$1;;
    # esac
    #
    #* Skip ahead to "Loops" chapter to decipher all this.

    cd $LOG_DIR
    # Not in /var/log?
    if [ `pwd` != "$LOG_DIR" ] # or if [ "$PWD" != "$LOG_DIR" ]
    then
        echo "Can't change to $LOG_DIR."
        exit $E_XCD
    fi # Doublecheck if in right directory before messing with log file.
    # Far more efficient is:
    #
    # cd /var/log || {
    # echo "Cannot change to necessary directory." >&2
    # exit $E_XCD;
    # }

    tail -n $lines messages > mesg.temp # Save last section of message log file.
    mv mesg.temp messages # Becomes new log directory.
    # cat /dev/null > messages
    #* No longer needed, as the above method is safer.
    cat /dev/null > wtmp # ': > wtmp' and '> wtmp' have the same effect.
    echo "Logs cleaned up."
    exit 0
    # A zero return value from the script upon exit indicates success
    #+ to the shell.
    ```

The comments in the example is to help understand the logic of the script. It's
helpful for beginners. For experienced shell script developers, the comments
are unnecessary. After removing comments, the script is clean.

!!! note "Example 2-4. Cleanup: Clean version."

    ```bash linenums="1"
    #!/bin/bash
    # Cleanup, version 3

    LOG_DIR=/var/log
    ROOT_UID=0

    # how many old lines to keep
    LINES=50

    SUCCESS=0
    E_XCD=86
    E_NOTROOT=87

    if [ "$UID" -ne "$ROOT_UID" ]
    then
        echo "Must be root to run this script."
        exit $E_NOTROOT
    fi

    if [ -n "$1" ]
    then
        lines=$1
    else
        lines=$LINES
    fi

    cd $LOG_DIR
    if [ `pwd` != "$LOG_DIR" ]
    then
        echo "Can't change to $LOG_DIR."
        exit $E_XCD
    fi

    tail -n $lines messages > mesg.temp
    # not sure if it works as messages exists, the option '-f' should be used to forcely overwrite
    mv mesg.temp messages
    cat /dev/null > wtmp
    echo "Logs cleaned up."
    exit ${SUCCESS}
    ```

As you see, by adding arguments validation and permission checking, the script
becomes much longer than the initial version. In practice, a shell script might
contain thousands lines of code.

Shell script can be invoked by `sh [path of the shell script]` or
`bash [path of the shell script]`. By making the script executable with a
`chmod` command, the shell script can be executed by relative path or absolute
path. By adding the parent path of the shell script to the `PATH` environment
variable, the shell script can be executed by typing `shell script name[ENTER]`
from the command line.

## Special Characters

### `#` Comments

Lines beginning with a `#` (with the exception of `#!`) are comments and will
not be executed. There are several different situations where comments are
used.

```bash linenums="1"
# 1. Normal comment: The script is written by Bruce Wen and used to clean system log files regulaly.
target_log_files="/var/log/messages /var/log/sudo.log"

latest_lines_total_to_keep=10 # 2. Comment after code: how many lines of the latest log messages to keep

# 3. Normal comment: to show if the log file contains any log entries having the keyword 'ERROR'
for log_file in "$target_log_files"
do
    grep -i ERROR $log_file ||\
    # 4. Comment embedded within a pipe: if not error then print a message to tell it
    echo "No error in $log_file"
done

        # 5. Comment after whitespaces: to continue developing the remaining part
```

!!! warning "Pipe characters `|` or `||` must be at the end of the line"

    The below code won't work because `||` is put at the beginning of the subsequent line
    ```bash linenums="1"
    grep -i ERROR $log_file \
    # 4. comment embedded within a pipe: if not error then print a message to tell it
    || echo "No error in $log_file"
    ```

A quoted or escaped \# in an echo statment does not begin a comment.

```bash linenums="1"

    echo "The # here does not begin a comment."
    echo 'The # here does not begin a comment.'
    echo The \# here does not begin a comment.
    echo The # here begins a comment.

```

!!! note "# is not only used for comments"

    * Parameter substituation `echo ${PATH#*:}` (show $PATH except for the first entry)
    * Base conversion `echo $(( 2#101011 ))` (display the number 101011 in binany)
    * Pattern match operation `${#var}` (return the length of the var value)

### `;` Command separator

Permits putting two or more commands on the same line.

```bash linenums="1"

    if [ -x "$filename" ]; then # it's better to have at least one space after ; to make the code more readable
        echo "$filename is executable."
    fi

```

### `;;` or `;;&` or `;&` Terminators in a `case` option

`;;` is used in bash 4 or older version `;;&` or `;&` are supported in bash 4+

```bash linenums="1"
    case "$variable" in
        abc) echo "\$variable = abc" ;;
        xyz) echo "\$variable = xyz" ;;
    esac
```

### `.` dot

- The dot command - equivalent to `source` and it's a bash builtin.
- The dot as a component of a filename. a leading dot is the prefix of a hidden file.
- The dot character match and it matches a single character.

### `'` and `"` Quoting

- `"` is used for partial quoting - "STRING" preserves (from interpretation) most of the special characters within STRING.
- `'` is used for full quoting - 'STRING' preserves all special characters within STRING. This is a stronger form of quoting than "STRING".

### `,` Comma operator

The comma operator links together a series of arithmetic operations. All are evaluated, but only the last one is returned.

```bash linenums="1"
> let "t2 = ((a = 9, 15 / 3))"
> echo $t2
5
```

The comma operator can also concatenate strings. The below example looks advanced. :smile:

```bash linenums="1"
> for file in /{,usr/}bin/*calc
> do
> if [ -x "$file" ]
> then
> echo $file
> fi
> done
/bin/hwloc-calc
/bin/mpicalc
/bin/oocalc
/usr/bin/hwloc-calc
/usr/bin/mpicalc
/usr/bin/oocalc
```

### `,, ,` Lowercase conversion in parameter substitution

It's added in version 4 of bash.

### `\` Escape

A quoting mechanism for single characters. \X escapes the character X. This has the effect of "quoting" X, equivalent to 'X'. The \ may be used to
quote " and ', so they are expressed literally.

### `/` Filename path separator

Separates the components of a filename (as in /home/bozo/projects/Makefile).
This is also the division arithmetic operator.

### ` Command substitution

The \`command\` construct makes available the output of command for
assignment to a variable. This is also known as backquotes or backticks.

### `:` Null command

This is the shell equivalent of a "NOP" (no op, a do-nothing operation). It
may be considered a synonym for the shell builtin true. The ":" command is itself a Bash builtin, and its exit status is true (0).

```bash linenums="1"
:
echo $? # 0
```

It can be used to construct an endless loop:

```bash linenums="1"
while :
do
 operation-1
 operation-2
 ...
 operation-n
done
```

The while loop is the same as:

```bash linenums="1"
while true
do
 operation-1
 operation-2
 ...
 operation-n
done
```

It can be used as a placeholder in if/else:

```bash linenums="1"
if condition
then :
else
    take some action
fi
```

Provide a placeholder where a binary operation is expected:

```bash linenums="1"
> : ${username=`whoami`}
> echo $username
wenijinew
> ${username=`whoami`}
bash: wenijinew: command not found
```

Evaluate string of variables using parameter substitution:

```bash linenums="1"
> : ${HOSTNAME?} ${USER?} ${MAIL?}
> : ${HOSTNAME?} ${USER?} ${MAIL?} ${ABC?}
bash: ABC: parameter null or not set
```

In combination with the > redirection operator, truncates a file to zero length, without changing its permissions. If the file did not previously exist, creates it.

```bash linenums="1"
> wc -l 7004e157.txt
42 7004e157.txt
> :> 7004e157.txt && wc -l 7004e157.txt
0 7004e157.txt
```

!!! note "`:> file.txt` vs `cat /dev/null > file.txt`"

    `:> file.txt` has the same effect with `cat /dev/null > file.txt` but `:> file.txt` won't fork a new process since `:` is a builtin.

!!! note "`:> file.txt` vs `:>> file.txt`"

    `:>> file.txt` has no effect if `file.txt` is previous-existing while `:> file.txt` will empty the content of `file.txt`if it's previous-existing.
    Both will create a new empty `file.txt` if it didn't previously exist.

May be used to begin a comment line, although this is not recommended. Using # for a comment turns off error checking for the remainder of that line, so almost anything may appear in a comment. However, this is not the case with :.

```bash linenums="1"
: This is a comment that generates an error, ( if [ $x -eq 3] ).
```

The ":" also serves as a field separator, in /etc/passwd, and in the $PATH variable.

### ! reverse (or negate) the sense of a test or exit status [bang].

```bash linenums="1"
> true
> echo "exit status of \"true\" = $?"
exit status of "true" = 0
> ! true
> echo "exit status of \"! true\" = $?"
exit status of "true" = 1
```

As an operator prefixing a command invokes the Bash history mechanism. It's an convenient way to call the history command starting with the text after `!`.
Here is an example:

```bash linenums="1"
> echo "Hello Bash!"
> Hello Bash!
> !echo
> echo "Hello Bash!"
```

Note that within a script, the history mechanism is disabled.

It also inverts the meaning of a test operator.
This can, for example, change the sense of equal ( = ) to not-equal ( != ).
The ! operator is a Bash keyword.

### \* wild card [asterisk]

The \* character serves as a "wild card" for filename expansion in globbing. By
itself, it matches every filename in a given directory.

```bash linenums="1"
> ls /etc/lvm/profile/* -1
/etc/lvm/profile/cache-mq.profile
/etc/lvm/profile/cache-smq.profile
/etc/lvm/profile/command_profile_template.profile
/etc/lvm/profile/lvmdbusd.profile
/etc/lvm/profile/metadata_profile_template.profile
/etc/lvm/profile/thin-generic.profile
/etc/lvm/profile/thin-performance.profile
/etc/lvm/profile/vdo-small.profile
```

The \* also represents any number (or zero) characters in a regular expression.

```bash linenums="1"
> find /etc/lvm/profile/ -iregex ".*/c.*.profile"
/etc/lvm/profile/cache-mq.profile
/etc/lvm/profile/cache-smq.profile
/etc/lvm/profile/command_profile_template.profile
```

In the context of arithmetic operations, the \* denotes multiplication.

```bash linenums="1"
> echo $((2 * 3))
6
```

A double asterisk (\*\*) can represent the exponentiation operator or extended file-match globbing.

```bash linenums="1"
# show file names in the current directory
> for f in *; do echo $f; done
json
json.lua
ltn12.lua
lxp
mime.lua
re.lua
socket
socket.lua

# show file names in the currect directory and sub-directories recursively
# must enable globstar, otherwise ** doesn't work.
> shopt -s globstar
> for f in **; do echo $f; done
json
json.lua
json/decode
json/decode.lua
json/decode/composite.lua
json/decode/number.lua
json/decode/others.lua
json/decode/state.lua
json/decode/state.lua.lua-52
json/decode/strings.lua
json/decode/util.lua
json/encode
json/encode.lua
json/encode/array.lua
json/encode/calls.lua
json/encode/number.lua
json/encode/object.lua
json/encode/others.lua
json/encode/output.lua
json/encode/output_utility.lua
json/encode/strings.lua
json/util.lua
ltn12.lua
lxp
lxp/lom.lua
mime.lua
re.lua
socket
socket.lua
socket/ftp.lua
socket/headers.lua
socket/http.lua
socket/smtp.lua
socket/tp.lua
socket/url.lua
```

### ? test operator or wild card

Within certain expressions, the ? indicates a test for a condition.

```bash linenums="1"
> var0=100
> (( var1 = var0 < 98 ? 9 : 21 ))
> echo $var1
21
```

The ? character serves as a single-character "wild card" for filename expansion in globbing, as well as representing one character in an extended regular expression.

```bash linenums="1"
> for f in jso?; do echo $f; done
json

> find $PWD -maxdepth 1 -regextype posix-extended -iregex ".*/jso?n"
/home/wenijinew/json
/home/wenijinew/jsn
```

### $ Variable substitution (Contents of a variable)

A $ prefixing a variable name indicates the value the variable holds.

```bash linenums="1"
> var="John"
> echo "Hello, $var"
Hello, John
```

In a regular expression, a "$" addresses the end of a line of text.

```bash linenums="1"
> cat 80d58021.txt | grep -E '.*8'
205332138
205334378
205335842
205336822
205336828
205338718
205341138
205341582

> cat 80d58021.txt | grep -E '.*8$'
205332138
205334378
205336828
205338718
205341138
```

Parameter substitution: `${parameter}` Same as $parameter, i.e., value of the variable parameter. In certain contexts, only the less ambiguous ${parameter} form works.

```bash linenums="1"
> name="John"
> id="${name}-on-${HOSTNAME}"
> echo "$id"
John-on-B.W
> id="$name-on-${HOSTNAME}"
> echo "$id"
John-on-B.W
> id="${name}on-${HOSTNAME}"
> echo "$id"
Johnon-B.W
> id="$nameon-${HOSTNAME}"
> echo "$id"
-B.W
```

Positional parameter: `$*` - All of the positional parameters, seen as a single word, `$@` - Same as `$*`, but each parameter is a quoted string, that is, the parameters are passed on intact, without interpretation or expansion. This means, among other things, that each parameter in the argument list is seen as a separate word.

!!! note "Usage of $\* and $@"

    `$*` _must_ be quoted, `$@` _should_ be quoted

Exit status variable: `$?`. The `$?` variable holds the exit status of a command, a function, or of the script itself.

Process ID variable: `$$`. The `$$` variable holds the process ID of the script in which it appears.

### `()` Command group

```bash linenums="1"
> (var="Hello, World"; echo $var)
Hello, World

> echo "$(which ldd)"
/usr/bin/ldd
```

!!! warning "A listing of commands within parentheses starts a subshell"

    Variables inside parentheses, within the subshell, are not visible to the rest of the script. The parent process, the script, cannot read variables created in the child process, the subshell.

    ```bash linenums="1"
    > name="John"
    > echo "Hello, $name"
    Hello, John
    > (name="Bruce"; echo "Hello, $name")
    Hello, Bruce
    > echo "Hello, $name"
    Hello, John
    ```

`()` can also be used to initialize an array.

```bash linenums="1"
> books=("To Kill a Mockingbird" "Pride and Prejudice" "1984")
> for book in "${books[@]}"; do echo $book; done
To Kill a Mockingbird
Pride and Prejudice
1984
```

### `{}` Brace expansion

```bash linenums="1"
> echo \'{These,words,are,quoted}\'
'These' 'words' 'are' 'quoted'

> echo \"{These,words,are,quoted}\"
"These" "words" "are" "quoted"

# Concatenates the files file1, file2, and file3 into combined_file.
> cat {file1,file2,file3} > combined_file

# Copy 6f63811b.txt to 6f63811b.bak - Is it a magic?
> cp 6f63811b.{txt,bak}
> ls 6f63811b*
6f63811b.bak  6f63811b.txt
```

!!! warning "No spaces allowed within the braces"

    _Unless_ the spaces are quoted or escaped

    ```bash linenums="1"
    > echo {file1,file2}\ :{\ A," B",' C'}
    file1 : A file1 : B file1 : C file2 : A file2 : B file2 : C

    # no escape for space before A
    > echo {file1,file2}\ :{ A," B",' C'}
    file1 :{ file2 :{ A, B, C}

    # no escape for space before A, zsh will complain with the error
    > echo {file1,file2}\ :{ A," B",' C'}
    zsh: parse error near `}'
    ```

Extended Brace expansion: {a..z}, {0..10}

```bash linenums="1"
> echo {a..z}
a b c d e f g h i j k l m n o p q r s t u v w x y z

> echo {0..10}
1 2 3 4 5 6 7 8 9 10
```

Block of code {code here}. Also referred to as an inline group, this construct, in effect, creates an anonymous function (a function without a name).
However, unlike in a "standard" function, the variables inside a code block remain visible to the remainder of the script.

```bash linenums="1"
> { local var; var="World"; }
bash: {local: command not found

> { var="World"; }
> echo $var
World
```

!!! warning "Space should be kept after { and before }"

    ```bash linenums="1"
    > {var="World";}
    bash: syntax error near unexpected token `}'
    ```

!!! warning "; should be used after statement"

    Otherwise, it's not interpretable by bash and have to terminate by `Ctrl+C`

    ```bash linenums="1"
    > { var="World" }
    >
    > ^C
    > { var="World"; }
    > echo "$var"
    World
    > { var="World"; action="Print" }
    >
    > ^C
    > { var="World"; action="Print"; }
    > echo "$var $action"
    World Print
    ```

The code block enclosed in braces may have I/O redirected to and from it.

    Unlike a command group within (parentheses), as above, a code block enclosed by {braces} will not normally launch a subshell.

Placeholder for text. Used after xargs -i (replace strings option). The {} double curly brackets are a placeholder for output text.

```bash linenums="1"
> find $PWD -type f -regextype posix-extended -iregex '.*421.txt' | xargs -i echo '{}'
/user/wenijinew/log/3167c421.txt
/user/wenijinew/log/521e8421.txt
```

Path name which is mostly used in `find` command. It's not a shell builtin.

```bash linenums="1"
> find $PWD -type f -regextype posix-extended -iregex '.*421.txt' -exec wc -l {} \;
24 /user/wenijinew/log/3167c421.txt
7 /user/wenijinew/log/521e8421.txt
```

    The ";" ends the -exec option of a find command sequence. It needs to be escaped to protect it from interpretation by the shell.

### `[]` Test operator

Test expression between `[ ]`. Note that [ is part of the shell builtin test (and a synonym for it), not a link to the external command `/usr/bin/test`.

Test expression between `[[]]`. More flexible than the single-bracket `[ ]` test, this is a shell keyword.

Array element. In the context of an array, brackets set off the numbering of each element of that array.

```bash linenums="1"
> books=("To Kill a Mockingbird" "Pride and Prejudice" "The Great Gatsby")
> size=${#books[@]}
> index=0
> while [ $index -lt $size  ];do echo ${books[$index]}; ((index++)); done
To Kill a Mockingbird
Pride and Prejudice
The Great Gatsby
```

Range of characters. As part of a regular expression, brackets delineate a range of characters to match.

```bash linenums="1"
> cat 6682cae1.txt | grep -iEo '[0-9:\-]{4,}\ [0-9:\-]{4,}' | head -2
2024-04-23 10:14:11
2024-04-23 10:14:12
```

Integer expansion. Evaluate integer expression between $[ ].

```bash linenums="1"
> echo $[1+2]
3
> echo $[1+2+100]
103
> echo $[$index + $size]
6
```

Note that this usage (`$[]`) is deprecated, and has been replaced by the `(( ... ))` construct.
