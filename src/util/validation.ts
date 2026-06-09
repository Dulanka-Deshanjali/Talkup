export const ValidateFirstName = (name:string):string|null =>{
    if(!name || name.trim().length === 0 ){
        return "First Name is required";
    }
    return null;
};

export const validateLastName =(name:string):string|null=>{
      if(!name || name.trim().length === 0 ){
        return "Last Name is required";
    }
    return null;
};

export const validateCountryCode =(countryCode:string):string | null=>{
    const regex = /^\+[1-9]\d{0,3}$/;
    if(!countryCode){
        return "Country Code is required";
    }
    if(!regex.test(countryCode)){
        return "Enter Valid CountryCode";
    }
    return null;
};

export const validatePhoneNo = (phoneNo:string):string|null=>{
    const regex = /^[1-9][0-9]{6,14}$/;

    if(!phoneNo){
        return "Phone Number is required"
    }

    if(!regex.test(phoneNo)){
        return "Enter Valid Phone Number"
    }

    return null;
}

export const validateProfileImage = (image:{
    uri:string;
    type?:string;
    fileSize?:number;

    }|null):string|null =>{
    if(!image){
        return "Profile image is required";
    }

    if(image.type && !["image/jpeg","image/jpg","image/png"].includes(image.type)){
        return "Select valid Image Type (JPEG,JPG,PNG)"
    }

    if(image.fileSize && image.fileSize > 10 * 1024 * 1024){
        return "Profile Image must be less than 5MB";
    }

    return null;
};