const aws= require('aws-sdk');
    const docClient= new aws.DynamoDB.DocumentClient({region: 'ap-south-1'});
    exports.handler= function(e,ctx,callback){
        var otp;
         var mail="da4@gmail.com";
        var scan ={
            TableName:'table2',
            Key: {
                email_id: mail
            }
        };
         var updatestatus = {
                            TableName: "table3",
                              Key: {
                                     Email_ID: mail,
                                    },
                             UpdateExpression: "set Status = :r",

                                   ExpressionAttributeValues: {
                                 ":r": "verified",
                                     },
                         ReturnValues: "UPDATED_NEW",
                     };
        docClient.get(scan,function(err,data){
            if(err){
                callback(err,null);
            }
            else{
                if(data)
                {
                    if(data.Item.Otp==otp)
                    {
                        console.log("verified successfully");
                        docClient.update(updatestatus, function(err,data)
                        {
                            if(err)
                            {
                                console.log("update failed");
                            }
                            else
                            {
                                console.log("update successfully");
                            }
                        });
                       
                    }
                }
                else
                {
                    callback(null,"data not found");
                }
                
            
                
            }
                
            
            
        });
    };