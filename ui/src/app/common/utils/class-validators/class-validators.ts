export class ClassValidator {
    /**
     * used for email field and validated using regex and type also
     */
    // emailVerifier: emailValidator
    public emailValidator(): any {
        const rulesblob = [
            { pattern: new RegExp("^[a-zA-Z0-9@.]+$"), message: `Please enter valid email, !#$%^&*()_+~{}[];',./:"<>?` + '`are not allowed' }]
        return rulesblob;
    }
    public emialPatternValidator(): any {
        const rulesblob = [
            { pattern: new RegExp("^([a-zA-Z0-9_.-]+)@([a-zA-Z0-9_.-]+)\\.([a-zA-Z]{2,5})$"), message: `Please enter valid email, !#$%^&*()+~{}[];',/:"<>?` + '`are not allowed' }]
        return rulesblob;
    }
    /**
     * Used For 
     * 1.ZipCode 
     */
    // numberOnly: onlyNumeric
    public onlyNumeric(): any {
        const rulesblob = [{ pattern: new RegExp("^[0-9]*$"), message: 'Invalid Input ! Please Enter Integers Only' },
        // { whitespace: true, message: 'White Spaces Are Not Allowed' }
    ]
        // console.log(rulesblob);
        return rulesblob;
    }
    /**
     * 
     */
    public onlyAlphabets(): any {
        const rulesblob = [{ pattern: new RegExp("^[a-zA-Z]+$"), message: 'Invalid Input ! Please Enter Alphabets Only,' + `!@#$%^&*()_-=+{}[]:";'<>?,./~1234567890` + '` Not Allowed' },
        { whitespace: true, message: 'White Spaces Are Not Allowed' }]
        // console.log(rulesblob);
        return rulesblob;
    }

    public onlyAlphabetsWithCapitalLetters(): any {
        const rulesblob = [{ pattern: new RegExp("^[A-Z]+$"), message: 'Invalid Input ! Please Enter Capital Alphabets Only,' + `abcdefghijklmnopqrstuvwxyz0123456789~!@#$%^&*()_+-={}[]|\:”;'<>?,./` + '` Not Allowed' },
        { whitespace: true, message: 'White Spaces Are Not Allowed' }]
        // console.log(rulesblob);
        return rulesblob;
    }
    
    /**
     * 
     */
    public floatCheck(): any {
        const rulesblob = [{ pattern: new RegExp("[\-\+]?[0-9]*(\.[0-9]+)?"), message: 'Invalid Input' },
        { whitespace: true, message: 'White Spaces Are Not Allowed' }]
        // console.log(rulesblob);
        return rulesblob;
        

    }
    /**
     * Used For 
     * 1.Latitude
     * 2.Longitude
     */
    // locationCoOrdinates: locationCoOrdinates
    public locationCoOrdinates(): any {
        const rulesblob = [{ pattern: new RegExp("^-?[0-9]{0,3}(?:\.[0-9]{1,10})?(\\s)?([E,W,S,N]?)$"), message: 'Invalid Input  ! Please Enter Location Co-Ordinates Pattern Only' },
        { whitespace: true, message: 'White Spaces Are Not Allowed' }]
        // console.log(rulesblob);
        return rulesblob;
    }
    /**
     * Used For 
     * 1.*_code
     * 2.Location Type
     */
    // alphaNumericWithoutSpecialCharectors: alphaNumericWithOutSpecialChars
    public alphaNumericWithOutSpecialChars(): any {
        const rulesblob = [{ pattern: new RegExp("^[a-zA-Z0-9\\s]+$"), message: `!@#$%^&*()_-=+{}[]:";'<>?,./~$()` + '` these are not Allowed' },
        { whitespace: true, message: 'White Spaces Are Not Allowed' }]
        return rulesblob;
    }

    public alphaNumericWithOutSpaces(): any {
        const rulesblob = [{ pattern: new RegExp("^[a-zA-Z0-9]+$"), message: `!@#$%^&*()_-=+{}[]:";'<>?,./~$()` + '` these are not Allowed' },
        { whitespace: true, message: 'White Spaces Are Not Allowed' }]
        return rulesblob;
    }

    public alphaNumericWithOutSpecialCharswithslash(): any {
        const rulesblob = [{ pattern: new RegExp("^[a-zA-Z0-9\\s\-]+$"), message: `!@#$%^&*()_-=+{}[]:";'<>?,./~$()` + '` these are not Allowed' },
        { whitespace: true, message: 'White Spaces Are Not Allowed' }]
        return rulesblob;
    }
    /**
     * used for Code name or code descriptions
     */
    public alphaSpacesForNameCodes(): any {
        const rulesblob = [{ pattern: new RegExp("^[a-zA-Z0-9\\s]+$"), message: `Invalid Input, !@#$%^&*()_-=+{}[]:";'<>?,./~ are not Allowed` },
        { whitespace: true, message: 'White Spaces Are Not Allowed' }]
        return rulesblob;
    }

    public codesValidation(): any {
        const rulesblob = [{ pattern: new RegExp("^[a-zA-Z0-9]+$"), message: `Space and !@#$%^&*()_-=+{}[]:";'<>?,./~ are not Allowed.` },
        { whitespace: false, message: '.' }]
        return rulesblob;
    }
    public lengthValidation(length: number, labelName: string): any {
        return [{ max: length, message: `${labelName} Should Not Be Greater Than ${length}` }];
    }

    /**
     * used for capital Alpha and numeric
     */
    public alphaNumericWithCapitals(): any {
        const rulesblob = [{ pattern: new RegExp("^[A-Z0-9\\s]+$"), message: `!@#$%^&*()_-=+{}[]:";'<>?,./~ and lower case alphabets are Not Allowed` },
        { whitespace: true, message: `!@#$%^&*()_-=+{}[]:";'<>?,./~ and lower case alphabets are Not Allowed` }]
        return rulesblob;
    }

    /**
     * used for capital Alpha and numeric
     */
    public alphaNumericWithCapitalsWithOutSpace(): any {
        const rulesblob = [{ pattern: new RegExp("^[A-Z0-9]+$"), message: `Space and !@#$%^&*()_-=+{}[]:";'<>?,./~ and lower case alphabets are Not Allowed` },
        { whitespace: true, message: `Space and !@#$%^&*()_-=+{}[]:";'<>?,./~ and lower case alphabets are Not Allowed` }]
        return rulesblob;
    }
    /**
     * Used For 
     * 1.first_name
     * 2.middle_name
     * 3.last_name
     * 4.country
     * 5.state
     */
    // alphabetsWithAcceptingSpaceinMiddle: alphaSpaces
    public alphaSpaces(): any {
        const rulesblob = [{ pattern: new RegExp("^[a-zA-Z\\s]+$"), message: `!@#$%^&*()_-=+{}[]:";'<>?,./~` + '`1234567890 are not Allowed' },
        { whitespace: true, message: 'White Spaces Are Not Allowed' }]
        return rulesblob;
    }
    /**
     * Used For 
     * 1.address_line_1
     * 2.address_line_2
     * 3.land_mark
     */
    // alphaNumericWithAcceptingSpaceinMiddleAndSpecialCharectors: alphaNumericSpecialCharsWithSpaces
    public alphaNumericSpecialCharsWithSpaces(): any {
        const rulesblob = [{ pattern: new RegExp("^[ A-Za-z0-9_@./#&+-_\\s-]*$"), message: 'Invalid Input' },
        { whitespace: true, message: 'White Spaces Are Not Allowed' }]
        return rulesblob;
    }
    /**
     * Used For
     * 1.door_no
     */
    // alphaNumericWithAcceptingSpecialCharectorsAndNotAcceptingSpaceinMiddle: alphaNumericSpecialCharsWithoutSpaces 
    public alphaNumericSpecialCharsWithoutSpaces(): any {
        //^[ A-Za-z0-9_@./#&+-]*$
        const rulesblob = [{ pattern: new RegExp("^[ A-Za-z0-9\\/#&-]*$"), message: 'Invalid Input' },
        { whitespace: true, message: 'White Spaces Are Not Allowed' }]
        return rulesblob;
    }
    /**
     * 1.Land_line_number
     * 2.Mobile_number ^([0|+[0-9]{1,5})?([7-9][0-9]{9})$
     */
    public phoneNumberValidations(): any {
        // const rulesblob = [{ pattern: new RegExp('^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\\s/0-9]*$'), 
        const rulesblob = [{ pattern: new RegExp('^[+]*[(+]{0,1}[0-9]{1,4}[)]{0,1}[\\s0-9]*$'), message: `QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklZxcvbnm/-!@#$%^&()_{}:"<>,./?;'[]~=` + '` are not allowed' },
        { whitespace: true, message: 'White Spaces Are Not Allowed' }]
        return rulesblob;
    }
    public timeValidation(): any {
        const rulesblob = [{ pattern: new RegExp("^([0-1][0-9]|[2][0-3]):([0-5][0-9])$"), message: `Please Enter 24-hour notation HH:MM Pattern (Ex: 08:00 and 23:59)` },
        { whitespace: false, message: '' }]
        return rulesblob;
    }
    public decimalValidator(): any {
        // const rulesblob = [{ pattern: new RegExp("^\d{0,2}(\.\d{1,2})?$"), message: `Please` },
        const rulesblob = [{ pattern: new RegExp(/^\d{1,3}(\.\d{1,2})?$/), message: `Please enter integer decimal of format nnn.nn` },
        { whitespace: false, message: '' }]
        return rulesblob;
    }
    public oneDecimalValidator(): any {
        // const rulesblob = [{ pattern: new RegExp("^\d{0,2}(\.\d{1,2})?$"), message: `Please` },
        const rulesblob = [{ pattern: new RegExp(/^\d{1,2}(\.\d{1})?$/), message: `Please enter integer decimal of format nn.n` },
        { whitespace: false, message: '' }]
        return rulesblob;
    }
    public twoDecimalValidator(): any {
        // const rulesblob = [{ pattern: new RegExp("^\d{0,2}(\.\d{1,2})?$"), message: `Please` },
        const rulesblob = [{ pattern: new RegExp(/^\d{1,2}(\.\d{1,2})?$/), message: `Please enter integer decimal of format nn.nn` },
        { whitespace: false, message: '' }]
        return rulesblob;
    }

    // public getEnvValue(environment: string, type: EnvVarTypes, varble: string): string {
    //     return 'nx';
    // }
}

export default ClassValidator;








