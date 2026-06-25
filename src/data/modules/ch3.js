export const ch3 = {
  title: "Chapter 3 - Exploring The System",
  items: [
    {
      id: "ch3-1",
      title: "Digging Deeper with ls",
      content: `
### ls: More Than Just Listing
The \`ls\` command can show file attributes, hidden files, sizes, and sorting. The general command shape is:

**command -options arguments**

**Common options:**
- \`-a\`: List all files, including hidden names that start with a dot.
- \`-l\`: Use the long listing format.
- \`-h\`: Display sizes in human-readable units.
- \`-t\`: Sort by modification time.

**Task:** List hidden files and detailed file information in the home directory.
      `,
      setupCommands: ["cd ~"],
      tasks: [
        { id: "t3-1", text: "List hidden files with details using 'ls -al'.", trigger: "ls -al", checkType: "input", completed: false },
        { id: "t3-2", text: "View file sizes in human-readable format using 'ls -lh'.", trigger: "ls -lh", checkType: "input", completed: false }
      ]
    },
    {
      id: "ch3-2",
      title: "Determining File Type",
      content: `
### Do Not Trust Extensions
In Linux, filename extensions like \`.jpg\` or \`.txt\` are not required. Use the \`file\` command to ask what a file actually contains.

In the Linux world, many system resources can be inspected as files. Learning to ask the system about a file is a core habit.

**Task:** Query the type of a system program and a configuration file.
      `,
      setupCommands: ["clear"],
      tasks: [
        { id: "t3-3", text: "Query the type of 'ls' with 'file /bin/ls'.", trigger: "file /bin/ls", checkType: "input", completed: false },
        { id: "t3-4", text: "Query a configuration file with 'file /etc/passwd'.", trigger: "file /etc/passwd", checkType: "input", completed: false }
      ]
    },
    {
      id: "ch3-3",
      title: "Reading Text with less",
      content: `
### less Is a Pager
The \`less\` command lets you view text files page by page.

**Why text matters:**
Most Linux system settings are stored in plain text files. This keeps the system inspectable.

**Navigation in less:**
- Page Up and Page Down move between pages.
- \`G\` goes to the end of the file.
- \`g\` goes to the beginning.
- \`/characters\` searches forward.
- \`q\` quits.

**Task:** Examine the system user list using \`less\`.
      `,
      setupCommands: ["clear"],
      tasks: [
        { id: "t3-5", text: "Run 'less /etc/passwd' and exit the pager with 'q'.", trigger: "less /etc/passwd", checkType: "input", completed: false }
      ]
    },
    {
      id: "ch3-4",
      title: "System Tour: Hierarchy",
      content: `
### Linux Filesystem Hierarchy
Linux systems follow a shared directory layout. Some important stops:

- \`/bin\`: Essential command binaries.
- \`/etc\`: System-wide configuration files.
- \`/var/log\`: System log files.
- \`/usr/bin\`: User application binaries.
- \`/boot\`: Kernel and boot files.

**Task:** Navigate to the center of system configuration and list what is there.
      `,
      setupCommands: ["clear"],
      tasks: [
        { id: "t3-6", text: "Go to the /etc directory with 'cd /etc'.", trigger: "cd /etc", checkType: "input", completed: false },
        { id: "t3-7", text: "List the files there with 'ls'.", trigger: "ls", checkType: "input", completed: false }
      ]
    },
    {
      id: "ch3-5",
      title: "Symbolic Links",
      content: `
### More Than a Shortcut
If the first character in an \`ls -l\` listing is \`l\`, the item is a **symbolic link**. A symbolic link lets one pathname point to another file or directory.

Example shape: \`name -> target\`

**Task:** Explore links in the \`/lib\` directory.
      `,
      setupCommands: ["cd /lib"],
      tasks: [
        { id: "t3-8", text: "List files with 'ls -l' and look for entries that contain '->'.", trigger: "ls -l", checkType: "input", completed: false }
      ]
    }
  ]
};
