const fs = require("fs");
const path = require("path");

const sourceDirectory = path.join(__dirname, 'files','un_organized');
const organizedDir = path.join(__dirname, 'files', 'organized');

// console.log("source directory: --->>", sourceDirectory);

const categories = {
    images: [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".svg"],
    documents: [".pdf", ".doc", ".docx", ".txt", ".rtf"],
    videos: [".mp4", ".avi", ".mkv", ".mov", ".wmv"],
    audio: [".mp3", ".wav", ".flac", ".aac", ".ogg"],
    code: [".js", ".py", ".java", ".cpp", ".html", ".css"],
    archives: [".zip", ".rar", ".tar", ".gz", ".7z"],
    spreadsheets: [".xls", ".xlsx", ".csv"],
    others: [],
};
const testFiles = [
    "vacation.jpg",
    "report.pdf",
    "presentation.pptx",
    "music.mp3",
    "video.mp4",
    "script.js",
    "data.csv",
    "archive.zip",
    "photo.png",
    "notes.txt",
    "app.py",
    "movie.avi",
    "song.wav",
    "backup.tar.gz",
    "random.xyz",
    "nodejs.zip",
];

const initializeDirectories = () =>{
    if(!fs.existsSync(sourceDirectory)){
        fs.mkdirSync(sourceDirectory,{recursive:true});
    }

    testFiles.forEach((file)=>{
        fs.writeFileSync(path.join(sourceDirectory,file),`Content of ${file}`);
    })
    console.log("Unorganized directory and its files created");

    //* making organized directory and its child directories - (category)
    if(!fs.existsSync(organizedDir)){
        fs.mkdirSync(organizedDir, {recursive : true});
    }

    Object.keys(categories).forEach((category)=>{
        const categoryPath = path.join(organizedDir,category);
        if(!fs.existsSync(categoryPath)){
            fs.mkdirSync(categoryPath);
        }
    })
}
// initializeDirectories();


/* const entries = Object.entries(categories); //? ->>->> 2D array
const categoryOnly = entries[0][0];
const extensionsArray = entries[0][1];

console.log("First category name: ", categoryOnly);
console.log(".......................");
console.log("First category's extension array: ",extensionsArray); */

const getCategory = (filename)=>{
    const ext = path.extname(filename).toLowerCase();

    for(const [category,extensions] of Object.entries(categories)){
        if(extensions.includes(ext)){
            return category;
        }
    }

    return "others";
}

// console.log(fs.statSync(sourceDirectory).isDirectory());

const organizeFiles = () =>{
    console.log("Source directory: >> ", sourceDirectory);
    console.log("Destination: ",organizedDir);

    console.log('\n'+'-'.repeat(50) + '\n');

    const files = fs.readdirSync(sourceDirectory);

    if(files.length === 0){
        console.log("No files to work on. Run 'init' first");
        return;
    }

    console.log(`\tFound ${files.length} files`);

    const fileStat = {
        total : 0,
        byCategory : {}
    }

    files.forEach((file)=>{
        const sourcePath = path.join(sourceDirectory,file);

        if(fs.statSync(sourcePath).isDirectory()){
            return;
        }

        const category = getCategory(file);
        const destDir = path.join(organizedDir, category);
        const destPath = path.join(destDir,file);

        fs.copyFileSync(sourcePath, destPath);

        fileStat.total++;

        if(fileStat.byCategory[category] === undefined){
            fileStat.byCategory[category] = 1;
        }
        else{
            fileStat.byCategory[category]++;
        }
    })

    console.log(fileStat);
}

const showHelp = () => {
    console.log(`
        file organizer - usage;

        commands:
        init - create files
        organize - organize files into categories

        example:
        node fileOrganizer.js init
        node fileOrganizer.js organize
        `)
}

const command = process.argv[2];

switch(command){
    case "init" :
        initializeDirectories();
        break;
    case "organize":
        organizeFiles();
        break;
    default:
        showHelp();
        break;
}