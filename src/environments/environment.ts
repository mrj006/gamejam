export const environment = {
    BACKEND: "http://129.153.186.161:80",
    BIRTH_ERROR: "You must be 18 or older to participate!",
    EMAIL_ERROR: "You must type a valid email!\tExpected format: user@example.com",
    EMAIL_REGEX: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})$/,
    PHONE_ERROR: "You must provide a valid phone number!\tExpected format: +1 234567890",
    PHONE_REGEX: /^\+\d{1,3}\s\d{1,14}$/,
    PASS_REGEX: /^[a-zA-Z0-9@#$%&*.!? ]{8,32}$/,
    PASS_ERROR: "Your password must be minimum 8 and maximum 32 characters long, and contain only letter, numbers and these special characters: @#$%&*.!? and space!",
    PITCH_REGEX: '^(https?://)?(?:www.)?(?<domain>[a-zA-Z.]*)/.+',
    PITCH_ERROR: 'You must provide a valid YouTube video URL!',
};