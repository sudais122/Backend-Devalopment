class APiError extends Error{
    constructor(
        statuscode,
        message = 'something went wrong',
        errors = [],
        stack = ''
    ){
        super(message);
        this.message = message;
        this.data = null;
        this.sucess = false;
        this.statuscode = statuscode;
        this.errors = errors;

        if(stack){
            this.stack = stack
        }
    }
}