# Let me call it "Tools"

## pre-commit

Git supports `pre-commit` hook to allow developers to do something before commit the code changes to the code respository. Meanwhile, [pre-commit](https://pre-commit.com/) is also a GitHub repository name.

## Git

If I want to always pull from remote branch before I push the local code changes to the remote repository, I can add the `git pull origin master` command in the file `.git\hooks\pre-push`.

To push the local code changes to gerrit, it's better to merge the local commits into one commit.

## Neovim

I configued the autocmd in `vimopt.lua` as below:

```lua linenums="1"
{
    "BufWritePre",
    {
        group = "_auto_check_xml_on_save",
        pattern = { "*.xml" },
        desc = "Automatically format on saving",
        callback = function()
            vim.cmd [[
            silent undojoin | w !xmllint --noout %
            ]]
            if vim.v.shell_error ~= 0 then
                -- Display an error message if the syntax check fails
                vim.api.nvim_echo("XML syntax check failed!", {})
            end
        end,
    }
},
```

However, when I test it, the below error ocurred:

```bash linenums="1"
Error detected while processing BufWritePre Autocommands for "*.xml":
Error executing lua callback: vim/_editor.lua:0: BufWritePre Autocommands for "*.xml"..script nvim_exec2() called at BufWritePre Autocommands for "*.xml":0: Vim(undojoin):E790: undojoin is not allowed after undo
stack traceback:
        [C]: in function 'nvim_exec2'
        vim/_editor.lua: in function 'cmd'
```

Finally, I fixed it with the below configuration:

```lua linenums="1" hl_lines="8-14"
{
    "BufWritePost",
    {
        group = "_auto_check_xml_on_save",
        pattern = { "*.xml" },
        desc = "Automatically format on saving",
        callback = function()
            local file = vim.api.nvim_buf_get_name(0)
            local command = "xmllint " .. file
            local output = vim.fn.system(command)
            if vim.v.shell_error ~= 0 then
                -- Display an error message if the syntax check fails
                log.error(output, "Command xmllint FAILED")
            end
        end,
    }
},
```

## MkDocs

MkDocs is a documentation system for Python projects. It is a great tool for creating professional-looking documentation websites with ease. MkDocs uses Markdown, a simple and readable syntax for writing text, which makes it easy to write and maintain documentation. With MkDocs, you can create a documentation site with just a few configuration files and Markdown files. The resulting site is beautifully formatted and includes features like a search bar, table of contents, and navigation menu. MkDocs is highly customizable and can be deployed to various hosting platforms, making it a popular choice for Python projects.
