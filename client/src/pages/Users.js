
import { Box, Button, Card, Container, Divider, Stack, Typography } from "@mui/material";
    import { useCallback, useEffect, useState } from "react";
   
    import api from "src/api";

import { UserTable } from "src/sections/user/user-table";

    const Users = () => {
        const[user,setUser]=useState([]);
        const [fetchData, setFetchData] = useState(false);

      useEffect(() => {
     
        const getUser = async () => {
          try {
            const res = await api.get(`/user/get-all-users`);
    
          setUser(res?.data?.users)
          } catch (error) {
            console.log(error,"error");
          }
        }; 
        getUser();
      }, [fetchData]);
  
     
      

      return (
        <>
       <Box
            sx={{
              flexGrow: 1,
              py: 8,
            }}
          >
            <Container maxWidth="xl">
              <Stack spacing={3}>
                <Stack
                  alignItems="flex-start"
                  direction="row"
                  justifyContent="space-between"
                  spacing={3}
                >
                <Typography variant="h4">Utenti</Typography>
                 
                </Stack>
                <div>
                  <Card>
               
                    <Divider />
                   <UserTable
                  user={user}
                  setUpdate={() => setFetchData(!fetchData)} 
                />
                  </Card>
                </div>
              </Stack>
            </Container>
          </Box>
        </>
      );
    };
    
   

export default Users;