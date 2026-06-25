export const ch4 = {
  title: "Chapter 4 - Manipulating Files and Directories",
  items: [
    {
      id: "ch4-1",
      title: "Wildcards",
      content: `
### The Power of Patterns
Before moving files, learn **wildcards**. They select groups of filenames based on patterns.

**Common wildcards:**
- \`*\`: Matches any characters.
- \`?\`: Matches any single character.
- \`[characters]\`: Matches any character in the set.
- \`[!characters]\`: Matches any character not in the set.
- \`[[:class:]]\`: Matches a character class such as \`[:digit:]\`, \`[:lower:]\`, or \`[:alnum:]\`.

**Examples:**
- \`g*\`: Names starting with \`g\`.
- \`b*.txt\`: Names starting with \`b\` and ending in \`.txt\`.
- \`Data???\`: \`Data\` followed by exactly three characters.
      `,
      setupCommands: ["mkdir -p ~/playground/dir1 ~/playground/dir2", "touch ~/playground/test1.txt ~/playground/test2.txt ~/playground/data.log", "cd ~/playground"],
      tasks: [
        { id: "t4-1", text: "List all files starting with 't' using 'ls t*'.", trigger: "ls t*", checkType: "input", completed: false }
      ]
    },
    {
      id: "ch4-2",
      title: "mkdir and cp",
      content: `
### Creating and Copying
- **mkdir** creates directories. You can create multiple directories at once.
- **cp** copies files or directories.

**Useful cp options:**
- \`-a\`: Archive mode, preserving permissions and attributes.
- \`-i\`: Interactive mode, asking before overwriting.
- \`-r\`: Recursive mode, required for copying directories.
- \`-u\`: Update mode, copying only newer or missing files.

**Task:** Create a backup directory and copy a file into it.
      `,
      setupCommands: ["mkdir -p ~/playground", "cd ~/playground", "touch file1.txt"],
      tasks: [
        { id: "t4-2", text: "Create a directory named backup with 'mkdir backup'.", trigger: "mkdir backup", checkType: "input", completed: false },
        { id: "t4-3", text: "Copy file1.txt into backup with 'cp file1.txt backup/'.", trigger: "cp file1.txt backup/", checkType: "input", completed: false }
      ]
    },
    {
      id: "ch4-3",
      title: "mv and rm",
      content: `
### Move, Rename, and Delete
- **mv** moves and renames files.
- **rm** removes files and directories.

Linux has no general undelete command. Once a file is removed, assume it is gone. Always test patterns with \`ls\` before using them with \`rm\`.

**Options:**
- \`rm -r\`: Delete a directory and its contents.
- \`rm -rf\`: Force recursive deletion. Use extreme caution.
      `,
      setupCommands: ["mkdir -p ~/playground", "cd ~/playground", "touch oldname.txt"],
      tasks: [
        { id: "t4-4", text: "Rename oldname.txt to newname.txt with 'mv oldname.txt newname.txt'.", trigger: "mv oldname.txt newname.txt", checkType: "input", completed: false },
        { id: "t4-5", text: "Delete newname.txt interactively with 'rm -i newname.txt'.", trigger: "rm -i newname.txt", checkType: "input", completed: false }
      ]
    },
    {
      id: "ch4-4",
      title: "Hard and Symbolic Links",
      content: `
### Linking Files
**Hard links:**
- Add another name for the same file.
- Cannot reference directories or files on different disk partitions.
- Are hard to distinguish from the original name.

**Symbolic links:**
- Point to another file or directory by pathname.
- Can cross physical devices.
- Break if the original target is removed.

**Commands:**
- \`ln file link\`: Create a hard link.
- \`ln -s item link\`: Create a symbolic link.
      `,
      setupCommands: ["mkdir -p ~/playground", "cd ~/playground", "echo 'Hello' > original.txt"],
      tasks: [
        { id: "t4-6", text: "Create a symbolic link with 'ln -s original.txt shortcut.txt'.", trigger: "ln -s original.txt shortcut.txt", checkType: "input", completed: false },
        { id: "t4-7", text: "Check inode numbers with 'ls -li'.", trigger: "ls -li", checkType: "input", completed: false }
      ]
    },
    {
      id: "ch4-5",
      title: "The Playground Project",
      content: `
### Lab: Putting It Together
This lab follows the spirit of the book's playground practice. You will create a workspace, copy a system file, and rename it.

**Steps:**
1. Go home.
2. Create \`playground\`.
3. Copy \`/etc/passwd\` into it.
4. Rename the copy and move it around.
      `,
      setupCommands: ["cd ~"],
      tasks: [
        { id: "t4-8", text: "Create playground with 'mkdir playground'.", trigger: "mkdir playground", checkType: "input", completed: false },
        { id: "t4-9", text: "Copy passwd to the current directory with 'cp /etc/passwd .'.", trigger: "cp /etc/passwd .", checkType: "input", completed: false },
        { id: "t4-10", text: "Rename passwd to fun with 'mv passwd fun'.", trigger: "mv passwd fun", checkType: "input", completed: false }
      ]
    }
  ]
};
