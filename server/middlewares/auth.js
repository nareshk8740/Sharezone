export const protect = async (req, res, next) => {
    try {
        const {userId} = await req.auth();
        if(!userId){
            return res.status(401).json({message: 'Not Authenticated'});
        }
        next()
    } catch (error) {
        res.json({success:false, message: error.message})
    }
}