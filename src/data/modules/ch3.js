export const ch3 = {
  title: "Chapter 3 – Exploring The System",
  items: [
    {
      id: "ch3-1",
      title: "Digging Deeper with ls",
      content: `
### ls: More Than Just Listing 🔍
The \`ls\` command allows us to understand file attributes. The general structure of commands is:
**command -options arguments**

**Common Options:**
- \`-a\`: List all files, including hidden ones (starting with a dot).
- \`-l\`: Use long listing format.
- \`-h\`: Display sizes in human-readable format (e.g., KB, MB).
- \`-t\`: Sort by modification time.



**Task:** Let's list the hidden files and details in the home directory.
      `,
      setupCommands: ["cd ~"],
      tasks: [
        { id: "t3-1", text: "List hidden files with details: 'ls -al'", trigger: "ls -al", checkType: "input", completed: false },
        { id: "t3-2", text: "View file sizes in human-readable format: 'ls -lh'", trigger: "ls -lh", checkType: "input", completed: false }
      ]
    },
    {
      id: "ch3-2",
      title: "Determining File Type (file)",
      content: `
### Don't Trust Extensions! 🕵️‍♂️
In Linux, file extensions (like .jpg, .txt) are not mandatory. We use the \`file\` command to determine what a file actually contains.

In the Linux world, "everything is a file."

**Task:** Query the type of a system program and a configuration file.
      `,
      setupCommands: ["clear"],
      tasks: [
        { id: "t3-3", text: "Query the type of 'ls': 'file /bin/ls'", trigger: "file /bin/ls", checkType: "input", completed: false },
        { id: "t3-4", text: "Query a configuration file: 'file /etc/passwd'", trigger: "file /etc/passwd", checkType: "input", completed: false }
      ]
    },
    {
      id: "ch3-3",
      title: "Reading Text (less)",
      content: `
### less is more 📖
The \`less\` command is a "pager" program that allows you to view text files page by page.

**Why Text?**
Most system settings in Linux are stored in plain text files. This makes the system transparent and inspectable.

**Navigation in less:**
- \`Page Up / Down\`: Move between pages.
- \`G\`: Go to the end of the file.
- \`g\`: Go to the beginning.
- \`/characters\`: Search forward.
- \`q\`: Quit.

**Task:** Examine the system user list using \`less\`.
      `,
      setupCommands: ["clear"],
      tasks: [
        { id: "t3-5", text: "Run 'less /etc/passwd' and exit with 'q'.", trigger: "less /etc/passwd", checkType: "input", completed: false }
      ]
    },
    {
      id: "ch3-4",
      title: "System Tour: Hierarchy",
      content: `
### Linux Filesystem Hierarchy Standard (FHS) 🗺️
Linux systems follow a specific standard (FHS). Some important stops:

- \`/bin\`: Essential command binaries.
- \`/etc\`: System-wide configuration files.
- \`/var/log\`: System log files.
- \`/usr/bin\`: Applications for users.
- \`/boot\`: Kernel and boot files.



**Task:** Navigate to the heart of configuration files and list them.
      `,
      setupCommands: ["clear"],
      tasks: [
        { id: "t3-6", text: "Go to /etc directory.", trigger: "cd /etc", checkType: "input", completed: false },
        { id: "t3-7", text: "List the files here.", trigger: "ls", checkType: "input", completed: false }
      ]
    },
    {
      id: "ch3-5",
      title: "Symbolic Links",
      content: `
### More Than a Shortcut: Symlinks 🔗
If you see an 'l' at the beginning of a line in \`ls -l\`, it's a **Symbolic Link**. It allows a file to have multiple names or switch between versions easily.

Example: \`libc.so.6 -> libc-2.6.so\`



**Task:** Explore links in the \`/lib\` directory.
      `,
      setupCommands: ["cd /lib"],
      tasks: [
        { id: "t3-8", text: "List files with 'ls -l' and look for files with '->'.", trigger: "ls -l", checkType: "input", completed: false }
      ]
    }
  ]
};