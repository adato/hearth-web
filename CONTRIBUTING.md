# Contributing to Hearth.net web project

This article is the main entrypoint for developers, who want to contribute to the open source project. This very first 
version of this file covers the basics of how the code is maintained, development cycle and how to get involved. Please 
do not hesitate to contribute changes even to this file. It is going to be constantly improving to be as clear as it 
could be. Any uncertain points will be polished and cleared in future versions of this file. Thank you for understanding 
and for your updates. It is greatly appreciated. 

## Branching of Hearth.net Web

There are three main branches in the project, Each has it's own purpose

* Production branch (branch named `master`) stores code, that is actually running on our [servers](https://www.hearth.net). 
It is locked for pushes and merges. Only pull requests can be merged by maintainers or administrators of the project.  
* Staging branch (branch name `staging`) stores approved changes to the production - see deployment cycle for details, how
it is distributed to master branch. When contributing any code, this is the branch that serves as source of new branches
with contributions. [Here](https://stage.hearth.net) you can see the staging version of Hearth.net Web. the API that is
responsible to fetch data for staging Hearth.net is running at https://api.stage.hearth.net and the data there do not 
interfere with production data. It is locked for pushes and merges. Only pull requests can be merged by maintainers or 
administrators of the project.
* Developing branch (branch name `develop`) mainly used for inhouse developers of Adato Paradigma. This branch is a mess
and it will be sooner or later deleted :-) 

## Deployment cycle

Each issue that is implemented into Hearth.net web goes through the same lifecycle. The life cycle is described below

* developer updates the git repository's branch `staging` on his/her box.
```bash
#if stage has never been pulled:
git checkout -b staging origin/staging

#otherwise
git checkout staging
git merge origin/staging
```
* developer takes the responsibility for the issue and creates new branch. Please refer to branch naming convention to 
properly name the branch  
```bash
git checkout -b name_of_new_branch staging
```
This may also be done be forking the stage branch and work on his/her own repository. But please maintain the naming 
convention, as well. 

* developer works on the implementation of the issue. When finished, tested and satisfied with the work, the process 
continues with another step

* new Pull Request (PR) is created in github. The PR should be targeted to staging branch. After creation of the PR the 
issue should be resolved

* PR is verified by automatic testing as well as maintainer of hearth.net web project and is either accepted, rejected 
or commented. Based on this the cycle is dependent on the state of the PR

* accepted PRs are squashed and merged into staging branch

* rejected PRs are commented with the reason why they are rejected and then closed. They will not be merged into staging 
branch 

* other PRs are commented and stay open until further changes, then reevaluated and either accepted or rejected

* staging branch is once in a while introduced to master branch as PR and merged. This is where the deployment cycle 
ends.

## Issue tracker 

Public Jira will be created in very short time. This document will be updated when it happens with more details.

## How can you contribute

Any help is wanted. It may be simple or more complex work: 
* document the code, from reading and understanding, how it works
* write unit tests or karma tests, some of them are already written, but it is very poor and we would love to get help 
here
* file a bug report - but when doing so, it is very needful to say how to reproduce the bug. The more specific bug report,
the better and easier way to fix it
* take responsibility of existing issue and help us implement it - it may be a fix of reported bug. Everything counts!

