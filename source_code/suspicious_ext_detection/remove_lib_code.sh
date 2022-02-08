# !/bin/bash
# remove lib JS code

# ignore empty space in the file name
MY_SAVEIFS=$IFS
#IFS=$(echo -en "\n\b")
IFS=$'\n'

# $1 is the root folder of extensions
# Example: $1="$HOME/Desktop/VerifiedMalicious"
path="$1/unzip/$2"
newpath="$1/clearJS/$2"
mkdir $newpath
for extension in $(ls $path)
do 
    mkdir $newpath/$extension
    # files=$(find $path/$extension -name "*.js" | grep -v "jquery\|vue\|bootstrap\|min\|chunk")
    files=$(find $path/$extension -name "*.js")
    for file in $files
    do
        cp $file $newpath/$extension
    done
done

    
# recover IFS
IFS=$MY_SAVEIFS