import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Rating, 
  Paper, 
  Container,
  Grid,
  Chip,
  Avatar,
} from '@mui/material';
import { 
  FeedbackOutlined, 
  PersonOutline, 
  EmailOutlined, 
  SendOutlined
} from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { submitFeedback } from '../services/api';

const schema = yup.object().shape({
   name: yup.string().required('Name is required'),
   email: yup.string().email().required('Email is required'),
   rating: yup.number().min(1).max(5).required('Rating is required'),
   comment: yup.string().optional(),
 });

export default function CreateFeedBack(){
    const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm({
      resolver: yupResolver(schema),
    });
  

    const onSubmit = async (data) => {
      // this is the api call
      try{
     await submitFeedback(data)
        reset();
      }catch(error){
        console.log(error)
      }
    };

    const ratingValue = watch('rating') || 0;

    const ratingLabels = {
      1: 'Poor',
      2: 'Fair', 
      3: 'Good',
      4: 'Very Good',
      5: 'Excellent'
    };

 return (
   <Box 
     sx={{
       minHeight: '100vh',
      //  background: 'linear-gradient(135deg,#ffff,rgb(132, 131, 133) 100%)',
       py: 4,
       px: 2
     }}
   >
     <Container maxWidth="md">
       <Box textAlign="center" mb={4}>
         <Avatar 
           sx={{ 
             width: 80, 
             height: 80, 
             mx: 'auto', 
            //  mb: 1,
             bgcolor: 'white',
             color: '#667eea'
           }}
         >
           <FeedbackOutlined sx={{ fontSize: 40 }} />
         </Avatar>
         <Typography 
           variant="h3" 
          //  component="h1" 
           fontWeight="bold" 
          //  color="white" 
          //  mb={1}
         >
           We Value Your Feedback
         </Typography>
         <Typography 
           variant="h6" 
          //  color="rgba(255,255,255,0.8)" 
           fontWeight="300"
         >
           Help us improve by sharing your experience
         </Typography>
       </Box>

       <Paper 
         elevation={12}
         sx={{
          width: '50%',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto',
           px: 4,
           py:6,
           borderRadius: 3,
           background: 'rgba(255,255,255,0.95)',
           backdropFilter: 'blur(10px)',
           border: '1px solid rgba(255,255,255,0.2)'
         }}
       >
         <form onSubmit={handleSubmit(onSubmit)}>
           <Grid container spacing={3}>
               <TextField
                 label="Your Name"
                 fullWidth
                 variant="outlined"
                 {...register('name')}
                 error={!!errors.name}
                 helperText={errors.name?.message}
                 InputProps={{
                   startAdornment: <PersonOutline sx={{ color: '#667eea', mr: 1 }} />
                 }}
                 sx={{
                   '& .MuiOutlinedInput-root': {
                     borderRadius: 2,
                     '&:hover fieldset': {
                       borderColor: '#667eea',
                     },
                   },
                 }}
               />
           
               <TextField
                 label="Email Address"
                 fullWidth
                 variant="outlined"
                 {...register('email')}
                 error={!!errors.email}
                 helperText={errors.email?.message}
                 InputProps={{
                   startAdornment: <EmailOutlined sx={{ color: '#667eea', mr: 1 }} />
                 }}
                 sx={{
                   '& .MuiOutlinedInput-root': {
                     borderRadius: 2,
                     '&:hover fieldset': {
                       borderColor: '#667eea',
                     },
                   },
                 }}
               />

             {/* Rating Section */}
             <Grid  xs={12} sx={{width: '100%'}} >
                 <Typography  color="grey">
                   Rate Your Experience
                 </Typography>
                 <Box display="flex" alignItems="center" gap={2} sx={{my: 2}}>
                   <Rating
                     value={ratingValue}
                     onChange={(_, value) => setValue('rating', value)}
                     size="small"
                     sx={{
                       fontSize: '2rem',
                       '& .MuiRating-iconFilled': {
                         color: '#FFD700',
                       },
                       '& .MuiRating-iconHover': {
                         color: '#FFA500',
                       },
                     }}
                   />
                   {ratingValue > 0 && (
                     <Chip 
                       label={ratingLabels[ratingValue]} 
                       sx={{ 
                         bgcolor: '#667eea',
                         color: 'white',
                         fontWeight: 'bold'
                       }} 
                     />
                   )}
                 </Box>
                 {errors.rating && (
                   <Typography color="error" sx={{ mt: 1 }}>
                     {errors.rating.message}
                   </Typography>
                 )}
               {/* Comments Section */}
                 <TextField
                   label="Tell us more about your experience..."
                   multiline
                   rows={4}
                   fullWidth
                   variant="outlined"
                   {...register('comment')}
                   error={!!errors.comment}
                   helperText={errors.comment?.message || "Share any additional thoughts or suggestions"}
                   sx={{
                     '& .MuiOutlinedInput-root': {
                       borderRadius: 2,
                       '&:hover fieldset': {
                         borderColor: '#667eea',
                       },
                     },
                   }}
                 />
      

             {/* Submit Button */}
                 <Button 
                   variant="contained" 
                   type="submit" 
                   fullWidth
                   startIcon={<SendOutlined />}
                   sx={{
                    marginTop: 2,
                     borderRadius: 3,
                     background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                     fontSize: '1.1rem',
                     fontWeight: 'bold',
                     textTransform: 'none',
                     boxShadow: '0 8px 32px rgba(102, 126, 234, 0.4)',
                     '&:hover': {
                       background: 'linear-gradient(45deg, #5a6fd8 30%, #6a4190 90%)',
                       boxShadow: '0 12px 40px rgba(102, 126, 234, 0.6)',
                       transform: 'translateY(-2px)',
                     },
                     transition: 'all 0.3s ease'
                   }}
                 >
                   Submit Feedback
                 </Button>
               </Grid>
           </Grid>
         </form>
       </Paper>

       {/* Footer */}
       <Box textAlign="center" mt={4}>
         <Typography 
           variant="body2" 
           color="rgba(255,255,255,0.7)"
         >
           Your feedback helps us create better experiences for everyone
         </Typography>
       </Box>
     </Container>
   </Box>
 );
}

