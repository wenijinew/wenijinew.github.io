# Shell Programming

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
