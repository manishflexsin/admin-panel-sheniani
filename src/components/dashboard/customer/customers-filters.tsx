import * as React from 'react';
import Card from '@mui/material/Card';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';

import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';
import axios from 'axios';


export function CustomersFilters(props:any): React.JSX.Element {
let page =props.page;
  const [searchTerm, setSearchTerm] = React.useState<string>(''); // State for search input
  // const [searchChangingTerm, setSearchChangingTerm] = React.useState<string>(''); // State for search input
  // const [results, setResults] = React.useState<any[]>([]); // State for search results
  const authToken = localStorage.getItem('auth-token');
 
// React.useEffect(() => {
//   const fetchData = async () => {
//     try{
//     let response;
    
//     if (searchTerm.trim() === "") {
      
//       response = await axios.get(`https://api.w7.flexsin.org/v1/admin/user/getAll?limit=10&page=${page}`, {
//         headers: {
//           'Authorization': `Bearer ${authToken}`,
//         },
//       });
//     }

//  if (response) {
//    props.storeUserdataList1(response.data);
//  }}
//  catch (error) {
//   console.error('Error fetching search results:', error);
//  }
//   };

//   fetchData();
// }, [searchTerm]); // Effect to handle search term changes
  

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
 
    const value = searchTerm;

    try {
      let response;
   
     response = await axios.get('http://localhost:3000/v1/admin/searchUser', {
        params: { name: value },
      });
      // Check if the response is an array
      props.storeUserdataList1 (response.data);
    } catch (error:any) {
      console.error('Error fetching search results:', error.response.data.message);
      alert(error.response.data.message);

     
    }
  };


  return (
    <Card sx={{ p: 2 }}>
      <OutlinedInput
        value={searchTerm}

        onChange={(e)=>{setSearchTerm(e.target.value)}} // Trigger search on input change
        fullWidth
        placeholder="Search customer"
        startAdornment={
          <InputAdornment position="start">
            <MagnifyingGlassIcon fontSize="var(--icon-fontSize-md)" />
          </InputAdornment>
        }
        sx={{ maxWidth: '500px' }}
      />

      <button onClick={handleClick} disabled={searchTerm? false : true} style={{width:'100px',height:"40px",background:"blue",color:"white"}}>Search</button>

      
    </Card>
  );
}