export const ch2 = {
  title: "Chapter 2 - Navigation",
  items: [
    {
      id: "ch2-1",
      title: "Understanding the File System Tree",
      bookSection: "Part 1, Chapter 2: Understanding The File System Tree",
      concepts: ["file system tree", "root directory", "directories", "paths"],
      content: `
### One Tree, One Root

Linux presents storage as a single file system tree. The top of that tree is the **root directory**, written as \`/\`.

Everything lives somewhere under \`/\`: programs, configuration files, user files, removable drives, and system directories. This is different from systems that show separate drive letters.

The purpose of this lesson is to make \`/\` feel like the starting point of the whole system.
      `,
      setupCommands: ["cd /", "clear"],
      tasks: [
        {
          id: "t2-1",
          text: "Print your current location with 'pwd'.",
          trigger: "pwd",
          checkType: "input",
          completed: false
        },
        {
          id: "t2-2",
          text: "List the top level of the file system tree with 'ls /'.",
          trigger: "ls /",
          checkType: "input",
          completed: false
        }
      ]
    },
    {
      id: "ch2-2",
      title: "The Current Working Directory",
      bookSection: "Part 1, Chapter 2: The Current Working Directory",
      concepts: ["current working directory", "pwd", "location"],
      content: `
### Where Am I?

The shell is always working from a current directory. Commands that use relative names interpret those names from this location.

Use \`pwd\`, short for **print working directory**, to ask the shell where you are. The answer is an absolute pathname.

This lesson implements the book's current working directory section.
      `,
      setupCommands: ["cd /usr", "clear"],
      tasks: [
        {
          id: "t2-3",
          text: "Display the current working directory with 'pwd'.",
          trigger: "pwd",
          checkType: "input",
          completed: false
        },
        {
          id: "t2-4",
          text: "Move to the root directory. Example: 'cd /'.",
          trigger: "cd /",
          checkType: "cwd",
          targetCwd: "/",
          completed: false
        },
        {
          id: "t2-5",
          text: "Confirm the new current working directory with 'pwd'.",
          trigger: "pwd",
          checkType: "input",
          completed: false
        }
      ]
    },
    {
      id: "ch2-3",
      title: "Listing Directory Contents",
      bookSection: "Part 1, Chapter 2: Listing The Contents Of A Directory",
      concepts: ["ls", "directory contents", "arguments"],
      content: `
### See What Is Here

The \`ls\` command lists the contents of a directory. Used by itself, it lists the current working directory. Given a pathname, it lists that location instead.

At this point in the book, the goal is not to learn every option. The goal is to connect a directory name with the items inside it.

This lesson implements the book's first \`ls\` navigation practice.
      `,
      setupCommands: ["cd /", "clear"],
      tasks: [
        {
          id: "t2-6",
          text: "List the current directory with 'ls'.",
          trigger: "ls",
          checkType: "input",
          completed: false
        },
        {
          id: "t2-7",
          text: "List the /usr directory with 'ls /usr'.",
          trigger: "ls /usr",
          checkType: "input",
          completed: false
        },
        {
          id: "t2-8",
          text: "List executable programs in /bin with 'ls /bin'.",
          trigger: "ls /bin",
          checkType: "input",
          completed: false
        }
      ]
    },
    {
      id: "ch2-4",
      title: "Changing the Current Working Directory",
      bookSection: "Part 1, Chapter 2: Changing The Current Working Directory",
      concepts: ["cd", "changing location", "pathnames"],
      content: `
### Move Around with cd

Use \`cd\`, short for **change directory**, to move the shell to a different current working directory.

After changing directories, use \`pwd\` to verify where you landed. This gives you a steady habit: move, then check.

This lesson implements the book's first \`cd\` practice.
      `,
      setupCommands: ["cd /", "clear"],
      tasks: [
        {
          id: "t2-9",
          text: "Change into /usr using any valid pathname. Example: 'cd /usr'.",
          trigger: "cd /usr",
          checkType: "cwd",
          targetCwd: "/usr",
          completed: false
        },
        {
          id: "t2-10",
          text: "Confirm your location with 'pwd'.",
          trigger: "pwd",
          checkType: "input",
          completed: false
        },
        {
          id: "t2-11",
          text: "Change into /usr/bin using any valid pathname. Example: 'cd /usr/bin'.",
          trigger: "cd /usr/bin",
          checkType: "cwd",
          targetCwd: "/usr/bin",
          completed: false
        }
      ]
    },
    {
      id: "ch2-5",
      title: "Absolute Pathnames",
      bookSection: "Part 1, Chapter 2: Absolute Pathnames",
      concepts: ["absolute pathname", "root", "leading slash"],
      content: `
### Start from Root

An **absolute pathname** begins with \`/\` and describes a location from the root of the file system tree.

Absolute pathnames work no matter where you currently are. For example, \`/usr/bin\` always means the same directory.

This lesson implements the book's absolute pathname section.
      `,
      setupCommands: ["cd /home", "clear"],
      tasks: [
        {
          id: "t2-12",
          text: "Move to /usr/bin using an absolute pathname. Example: 'cd /usr/bin'.",
          trigger: "cd /usr/bin",
          checkType: "cwd",
          targetCwd: "/usr/bin",
          completed: false
        },
        {
          id: "t2-13",
          text: "Print the resulting directory with 'pwd'.",
          trigger: "pwd",
          checkType: "input",
          completed: false
        },
        {
          id: "t2-14",
          text: "Return to the root directory using any valid pathname. Example: 'cd /'.",
          trigger: "cd /",
          checkType: "cwd",
          targetCwd: "/",
          completed: false
        }
      ]
    },
    {
      id: "ch2-6",
      title: "Relative Pathnames",
      bookSection: "Part 1, Chapter 2: Relative Pathnames",
      concepts: ["relative pathname", ".", "..", "parent directory"],
      content: `
### Start from Where You Are

A **relative pathname** starts from the current working directory instead of the root directory.

Two special names are central:

- \`.\` means the current directory.
- \`..\` means the parent directory.

Relative pathnames are shorter, but they depend on where you are standing in the tree.

This lesson implements the book's relative pathname section.
      `,
      setupCommands: ["cd /usr/bin", "clear"],
      tasks: [
        {
          id: "t2-15",
          text: "Move up to the parent directory, ending in /usr. Example: 'cd ..'.",
          trigger: "cd ..",
          checkType: "cwd",
          targetCwd: "/usr",
          completed: false
        },
        {
          id: "t2-16",
          text: "Confirm that you are now in /usr with 'pwd'.",
          trigger: "pwd",
          checkType: "input",
          completed: false
        },
        {
          id: "t2-17",
          text: "Move back into /usr/bin using a relative pathname. Example: 'cd ./bin'.",
          trigger: "cd ./bin",
          checkType: "cwd",
          targetCwd: "/usr/bin",
          completed: false
        }
      ]
    },
    {
      id: "ch2-7",
      title: "Helpful Navigation Shortcuts",
      bookSection: "Part 1, Chapter 2: Some Helpful Shortcuts",
      concepts: ["cd", "cd -", "cd ~", "home directory"],
      content: `
### Move Faster

The book introduces a few shortcuts that make navigation less repetitive:

- \`cd\` changes to your home directory.
- \`cd ~\` also changes to your home directory.
- \`cd -\` changes to the previous working directory.

These are small conveniences, but they become muscle memory quickly.

This lesson implements the book's helpful shortcuts section.
      `,
      setupCommands: ["cd /var/log", "clear"],
      tasks: [
        {
          id: "t2-18",
          text: "Jump to your home directory. Example: 'cd'.",
          trigger: "cd",
          checkType: "cwd",
          targetCwd: "/root",
          completed: false
        },
        {
          id: "t2-19",
          text: "Return to the previous working directory, ending in /var/log. Example: 'cd -'.",
          trigger: "cd -",
          checkType: "cwd",
          targetCwd: "/var/log",
          completed: false
        },
        {
          id: "t2-20",
          text: "Jump home again. Example: 'cd ~'.",
          trigger: "cd ~",
          checkType: "cwd",
          targetCwd: "/root",
          completed: false
        }
      ]
    },
    {
      id: "ch2-8",
      title: "Important Facts About Filenames",
      bookSection: "Part 1, Chapter 2: Important Facts About Filenames",
      concepts: ["case sensitivity", "hidden files", "spaces", "punctuation"],
      content: `
### Names Matter

Linux filenames are case-sensitive: \`File\`, \`file\`, and \`FILE\` are different names.

Names that begin with a dot are hidden from ordinary \`ls\` output. They are not secret; they are simply omitted unless you ask for all names.

Linux permits spaces and punctuation in filenames, but simple names are easier to type and safer for beginners. The book recommends avoiding spaces in names while you are building command-line habits.

This lesson implements the book's filename facts section.
      `,
      setupCommands: ["mkdir -p ~/chapter2-filenames", "cd ~/chapter2-filenames", "touch file File .hidden navigation_notes", "clear"],
      tasks: [
        {
          id: "t2-21",
          text: "List ordinary names with 'ls'. Notice that .hidden is omitted.",
          trigger: "ls",
          checkType: "input",
          completed: false
        },
        {
          id: "t2-22",
          text: "List all names, including hidden ones, with 'ls -a'.",
          trigger: "ls -a",
          checkType: "input",
          completed: false
        },
        {
          id: "t2-23",
          text: "Inspect the two case-sensitive names with 'ls file File'.",
          trigger: "ls file file",
          checkType: "input",
          completed: false
        }
      ]
    }
  ]
};
