#!/bin/bash
declare -a coreDeps=(body-parser debug express morgan firebase firebase-admin)
declare -a devDeps=(typescript gulp gulp-typescript chai chai-http mocha ts-node @types/body-parser @types/chai @types/chai-http @types/debug @types/express @types/mocha @types/morgan @types/node @types/firebase)

proj_dir=''

function installDeps() {
	local args=("$@")
	local nArgs=${#args[@]}
	local category=$1
	local deps=(${args[@]:1:$nArgs})
	local len=${#deps[@]}

	# TODO: concatenate dependencies and install everything at once
	for (( i=0; i<$len; i++ )); do
		local v=$(npm show ${deps[$i]} version)
		if [[ $category == 'dev' ]]; then
			npm install ${deps[$i]}@${v} --save-dev
		else
			npm install ${deps[$i]}@${v} --save
		fi
	done
}

function error() {
	echo "Please sepcify the project location with the -d option."
	exit
}

function init() {
	echo "Initializing project. . ."
	$(mkdir ${proj_dir})
	cd ${proj_dir}
	# initialize node.js
	npm init -y

	installDeps "core" "${coreDeps[@]}"
	installDeps "dev" "${devDeps[@]}"

	# TODO:
	# 1. create tsconfig.json
	# 	1.1 configure the file with 
	# 2. mkdir src
	# 3. create gulpfile.js
	# 	3.1 create gulpfile with tasks

	# TODO: add option for installing database(s)

	exit
}

function invalidFlag() {
	local flag=$1
	echo "Invalid flag: ${flag}"
	exit
}

while getopts 'd:' flag; do
	case "${flag}" in
		d) proj_dir="${OPTARG}" ;;
		*) invalidFlag ${flag} ;;
	esac

	if [[ -z $proj_dir ]]; then
		error
	elif [[ -d $proj_dir ]]; then
		read -p "Directory ${proj_dir} already exists. Would you like to remove its contents and reinitialize (y/n)?" opt

		if [[ $opt == 'y' || $opt == 'Y' ]]; then
			echo "Force removing directory ${proj_dir}. . ."
			$(rm -fr $proj_dir)
		else
			echo "Directory already exists. Please choose a different location or delete the directory."
			exit
		fi
	fi
	
	init
done

error