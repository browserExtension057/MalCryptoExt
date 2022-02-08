#！/bin/bash
# unzip all the extensions in the folder

# ignore empty space in the file name
#MY_SAVEIFS=$IFS
#IFS=$(echo -en "\n\b")
#IFS=$'\n'

# $1 is the root folder of extensions
# Example: $1="$HOME/Desktop/VerifiedMalicious"

newpath="$1/unzip/$2"
mkdir $newpath

path="$1/zip/$2"
files=$(ls $path)
echo "start to unzip folder $path"
for filename in $files
do
    unzip $path/$filename -d $newpath/${filename%.*}
done

# recover IFS
#sIFS=$MY_SAVEIFS
