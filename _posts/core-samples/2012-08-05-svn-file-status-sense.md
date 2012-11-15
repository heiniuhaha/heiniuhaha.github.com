---
layout: post
title : 	svn 文件状态标记含义
description : 一直用的是mac Terminal，需要使用svn命令，掌握下svn 文件状态标记含义。
category : svn
tags : [linux, svn]
---
{% include JB/setup %}
###svn 文件状态标记含义  

svn status打印五列字符，紧跟一些空格，接着是文件或者目录名。第一列告诉一个文件的状态或它的内容，返回代码解释如下：

####`A item`

文件、目录或是符号链item预定加入到版本库。

####`C item`

文件item发生冲突，在从服务器更新时与本地版本发生交迭，在你提交到版本库前，必须手工的解决冲突。

####`D item`

文件、目录或是符号链item预定从版本库中删除。

####`M item`

文件item的内容被修改了。

####`R item`

文件、目录或是符号链item预定将要替换版本库中的item，这意味着这个对象首先要被删除，另外一个同名的对象将要被添加，所有的操作发生在一个修订版本。

####`X item`

目录没有版本化，但是与Subversion的外部定义关联，关于外部定义，可以看“外部定义”一节。

####`? item`

文件、目录或是符号链item不在版本控制之下，你可以通过使用svn status的--quiet（-q）参数或父目录的svn:ignore属性忽略这个问题，关于忽略文件的使用，见“svn:ignore”一节。

####`! item`

文件、目录或是符号链item在版本控制之下，但是已经丢失或者不完整，这可能因为使用非Subversion命令删除造成的，如果是一个目录，有可能是检出或是更新时的中断造成的，使用svn update可以重新从版本库获得文件或者目录，也可以使用svn revert file恢复原来的文件。

####`~ item`

文件、目录或是符号链item在版本库已经存在，但你的工作拷贝中的是另一个。举一个例子，你删除了一个版本库的文件，新建了一个在原来的位置，而且整个过程中没有使用svn delete或是svn add。

####`I item`

文件、目录或是符号链item不在版本控制下，Subversion已经配置好了会在svn add、svn import和svn status命令忽略这个文件，关于忽略文件，见“svn:ignore”一节。注意，这个符号只会在使用svn status的参数--no-ignore时才会出现—否则这个文件会被忽略且不会显示！