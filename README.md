# git-batch-clone

> 批量克隆或更新git仓库

## 安装 `Installation`

**Note:** 如果需要使用 git-batch-clone 的命令行工具，请全局安装。

``` bash
  $ [sudo] npm install git-batch-clone -g
```

**Note:** 如果需要使用 git-batch-clone 开发你的程序请按如下方式安装

``` bash
  $ cd /path/to/your/project
  $ [sudo] npm install git-batch-clone -g
```

## 用法 `Usage`
有两种方式使用 git-batch-clone，通过命令行或者在你的代码中引入。

### 命令行用法 `Command Line Usage`
你可以在你的工作目录（有git仓库配置文件 configfile.json 的目录），运行 git-batch-clone 批量克隆或更新git仓库。

**Example**

``` bash
  $ cd /path/to/your/workspace
  $ git-batch
```

**Options**
```
  $ git-batch --help

  Usage: git-batch [options]

  start clone and config git repos

  Options:

    -h, --help            output usage information
    -V, --version         output the version number
    -c, --config [value]  the configfile
```

### JSON 配置文件 `JSON Configuration File`
git仓库的JSON配置文件要按如下格式编写，默认文件名为`configfile.json`。如果使用其他名字，可以使用 `-c other_configfile.json` 来指定。

``` json
{
  "global": {
    "host": "ssh://host.your-git-resource.com/",
    "config": {
      "user.name": "your name",
      "user.email": "your email",
      ...
    },
    "branch": {
      "local": "develop",
      "remote": "origin/develop"
    }
  },
  "repos": [{
    "repo": "project0"
  }, {
    "repo": "project1",
    "mapping": "project_one",
  }, {
    "host":"https://git.other.com/",
    "repo":"project2",
    "mapping":"other_repos/project2",
    "branch":{
      "local":"master",
      "remote":"origin"
    },
    "config": {
      "user.name": "your other name"
    }
  }, {
    "host":"https://github.com/",
    "repo":"your_github_name/your_github_repo",
    "mapping":"github/your_github_repo",
    "branch":{
      "local":"master",
      "remote":"origin"
    },
    "config": {
      "user.name": "your github name",
      "user.email": "your github email"
    }
  }]
}
```

```
global：全局配置
  host：git仓库的host
  config：git config配置项（key:value）
  branch：默认git分支
    local：本地分支名称
    remote：远程分支名称
repos：repo的自定义配置
  repo：git仓库名称
  mapping：本地路径（非必填）
  其他参数同全局配置，每个repo都会继承global的配置，如果配置了，会覆盖全局配置对应项。
```

**Note** 克隆和更新使用同样的命令即可，git-batch-clone 会自动检测目录下所有git仓库的状态进行相应的处理。

### 在你的代码中引用 `Using In Your Code`
除了命令行的方式，git-batch-clone 还支持在你的代码中引入的方式，方便你开发自己的代码。

``` js

  import gitBatch from "git-batch-clone"

  gitBatch(dirname, configs).then(function(){
    console.log('success');
  });

```

```
  dirname: 需要执行git批量操作的目录
  configs: git repos配置json，结构同上面的 configfile.json
```
