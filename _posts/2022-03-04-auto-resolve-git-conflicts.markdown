---
layout: post
title:  Auto-resolve Git conflicts
date:   2022-03-04 08:00:00 -0500
categories: git
---

If you collaborate with others using [git](https://git-scm.com/) source control then you've likely run into conflicts when merging or rebasing.

```
git rebase main
CONFLICT (content): Merge conflict in spec/models/user_spec.rb
error: could not apply 749e6289b9... Fix line lengths for Rubocop
hint: Resolve all conflicts manually, mark them as resolved with
hint: "git add/rm <conflicted_files>", then run "git rebase --continue".
hint: You can instead skip this commit: run "git rebase --skip".
hint: To abort and get back to the state before "git rebase", run "git rebase --abort".
Could not apply 749e6289b9... Fix line lengths for Rubocop
```

We could resolve all of these conflicts in each file manually. But, what if we know which branch should win for all cases? This could happen when many changes are generated rather than written by a person. If we know which branch we want to take the changes from in all conflicts we can specify this with the `--strategy-option` (or `-X`) argument.

## Merge

When merging, we can [specify the strategy](https://git-scm.com/docs/git-merge#Documentation/git-merge.txt---strategy-optionltoptiongt) as `theirs` or `ours`.

If we specify `theirs` then all conflicts will take the changes from the incoming branch. Specifying `ours` will take the changes from the current branch.

```sh
git checkout my-feature-branch
git merge -X theirs main
```

That would resolve any conflicts by taking the changes from the `main` branch and apply them to the current working `my-feature-branch`.

We can do the opposite as well.

```sh
git merge -X ours main
```

That will apply the changes from `my-feature-branch` when a conflict occurs.

After merging, it's always good to do some manual inspection to ensure things looks like we expect.

```sh
git diff main
```

## Rebase

When we `rebase` git replays each commit from the working branch on top of the <upstream> branch. This means that the `ours` strategy takes the changes from the <upstream> branch which is the opposite from how this strategy works with merge.

```sh
git rebase -X ours main
```

That will apply the changes from `main` when a conflict occurs.

```sh
git rebase -X theirs main
```

That will apply the changes from `my-feature-branch` when a conflict occurs.

## Avoiding lost changes from others

If your main goal is to avoid dropping the changes from others when merging or rebasing then these are the two commands you'll want to use:

```sh
# Take the changes from main when there's a conflict
git merge -X theirs main

# take the changes from main when there's a conflict
git rebase -X ours main
```
