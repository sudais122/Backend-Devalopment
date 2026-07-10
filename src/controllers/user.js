const register = (req, res) => {
  res.status(200).json({
    message: "This is register response",
  });
};

const login = (req,res) => {
  res.status(200).json({
    message: "this is login",
  });
};

const forgotpassword = async (req,res)=>{
    res.status(200).json({
        message: 'this is forgot password'
    })
}
export { login, register, forgotpassword };
