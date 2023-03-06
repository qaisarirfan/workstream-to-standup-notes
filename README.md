# workstream-to-standup-notes

This code reads a directory containing CSV files and extracts data from them. It then filters the extracted data based on certain criteria, and uses it to create a new set of notes. Finally, it saves the notes as a new CSV file.

Here is a more detailed explanation of the steps taken:
* The code reads the files in the directory specified by the `PROJECTS_LOGS_PATH` constant using the `fs.readdirSync()` function.
* It filters the files based on whether they have a `.csv` extension using the `files.filter()` method, and stores the resulting array in the `csvFiles` variable.
* The code then creates an empty array called `abc`.
* It loops through each file in the `csvFiles` array using the `csvFiles.forEach()` method.
* For each file, the code reads the file using the `fs.readFileSync()` method and extracts the data as a string.
* It then parses the string as CSV data using the `parse()` method from the `csv-parse` library, with the options `columns: true` and `skip_empty_lines: true`.
* It filters the resulting array of records based on whether they contain a certain value for the "Team" field. The specific value(s) to be filtered is determined by the `TEAMS` constant.
* For each record in the filtered array, the code extracts relevant data and creates a new object representing a note.
* It then adds the note object to the `abc` array.
* If an error occurs while reading or parsing a file, the error message is logged to the console.
* After all the files have been processed, the code checks whether the `abc` array is not empty.
* If the `abc` array is not empty, it converts the array to a CSV string using the `json2csv.parse()` method from the `json2csv` library.
* It then writes the CSV string to a new file specified by the `STANDUP_NOTES_PATH` and `STANDUP_NOTES_FILE` constants using the `fs.writeFile()` method.
* If an error occurs while writing the file, the error message is logged to the console.
* If the file is successfully written, the message "Saved!" is logged to the console.