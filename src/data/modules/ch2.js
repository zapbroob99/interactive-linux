export const ch2 = {
  title: "Chapter 2 - Navigation",
  items: [
    {
      id: "ch2-1",
      title: "File System Tree",
      content: `
### File System Hierarchy
Unlike Windows, Linux organizes all drives and files into a single tree structure. The top of this tree is called the **root directory**, represented by a forward slash (\`/\`).

**Where am I?**
Since there is no visual guide in the terminal, you can find out where you are using the \`pwd\` command. It stands for Print Working Directory.
      `,
      setupCommands: ["cd /home"],
      tasks: [
        { id: "t2-1", text: "Find out where you are with 'pwd'.", trigger: "pwd", checkType: "input", completed: false },
        { id: "t2-2", text: "List the files in the current directory with 'ls'.", trigger: "ls", checkType: "input", completed: false }
      ]
    },
    {
      id: "ch2-2",
      title: "Absolute and Relative Paths",
      content: `
### Pathnames
There are two ways to describe a location:

1. **Absolute pathnames** start from the root directory, such as \`/usr/bin\`.
2. **Relative pathnames** start from your current directory. The names \`.\` and \`..\` mean the current directory and the parent directory.
      `,
      setupCommands: ["cd /"],
      tasks: [
        { id: "t2-3", text: "Navigate using an absolute pathname: 'cd /usr/bin'.", trigger: "cd /usr/bin", checkType: "input", completed: false },
        { id: "t2-4", text: "Go to the parent directory with 'cd ..'.", trigger: "cd ..", checkType: "input", completed: false }
      ]
    },
    {
      id: "ch2-3",
      title: "Navigation Shortcuts",
      content: `
### Quick Moves
- \`cd\` takes you to your home directory.
- \`cd -\` takes you back to the previous working directory.

These shortcuts make navigation feel less like typing full paths and more like moving through a workspace.
      `,
      setupCommands: ["cd /var/log"],
      tasks: [
        { id: "t2-5", text: "Go to your home directory with 'cd'.", trigger: "cd", checkType: "input", completed: false },
        { id: "t2-6", text: "Return to the previous directory with 'cd -'.", trigger: "cd -", checkType: "input", completed: false }
      ]
    }
  ]
};
