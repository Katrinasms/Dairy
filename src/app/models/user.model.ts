export class User {
    
    constructor(
        public u_id: string,
        public name: string,
        public email: string,
        public password: string,
        public font?: string,
        public theme?: string
    ) {}

}