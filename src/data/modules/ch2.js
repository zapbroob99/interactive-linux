export const ch2 = {
  title: "Chapter 2 – Navigation",
  items: [
    {
      id: "ch2-1",
      title: "File System Tree",
      content: `
### File System Hierarchy 🌳
Unlike Windows, Linux organizes all drives and files into a single, large "tree" structure. The top of this tree is called the **root directory**, represented by a forward slash (\`/\`).

**Where am I?**
Since there is no visual guide in the terminal, you can find out where you are using the \`pwd\` (Print Working Directory) command.
      `,
      setupCommands: ["cd /home"],
      tasks: [
        { id: "t2-1", text: "Find out where you are (pwd).", trigger: "pwd", checkType: "input", completed: false },
        { id: "t2-2", text: "List the files (ls).", trigger: "ls", checkType: "input", completed: false }
      ]
    },
    {
      id: "ch2-2",
      title: "Absolute and Relative Paths",
      content: `
### Pathnames 🗺️
There are two ways to navigate:
1. **Absolute Path:** Starts from the root directory (\`/\`).
2. **Relative Path:** Starts from your current directory. (\`.\` and \`..\`)
      `,
      setupCommands: ["cd /"],
      tasks: [
        { id: "t2-3", text: "Navigate using an absolute path: 'cd /usr/bin'", trigger: "cd /usr/bin", checkType: "input", completed: false },
        { id: "t2-4", text: "Go to the parent directory: 'cd ..'", trigger: "cd ..", checkType: "input", completed: false }
      ]
    },
    {
      id: "ch2-3",
      title: "Navigation Shortcuts",
      content: `
### Quick Moves ⚡
- \`cd\`: Takes you to your home directory.
- \`cd -\`: Takes you back to the previous directory.
      `,
      setupCommands: ["cd /var/log"],
      tasks: [
        { id: "t2-5", text: "Go to your home directory (cd).", trigger: "cd", checkType: "input", completed: false },
        { id: "t2-6", text: "Go back to the previous directory (cd -).", trigger: "cd -", checkType: "input", completed: false }
      ]
    }
  ]
};