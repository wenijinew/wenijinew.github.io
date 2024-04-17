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
