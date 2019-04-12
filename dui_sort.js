function tiaoz(arr,index,dlen){
           // console.log(arr,dlen);
            var left=2*index+1,
                right=2*index+2;
            if(left>dlen-1){
                return;
            }
            if(dlen-1<right){
                if(arr[index]<=arr[left]){
                    let a=arr[index];
                    arr[index]=arr[left];
                    arr[left]=a;
                    tiaoz(arr,left,dlen);
                }
            }else{
                    if(arr[left]>=arr[index]&&arr[left]>=arr[right]){
                        let a=arr[index];
                        arr[index]=arr[left];
                        arr[left]=a;
                        tiaoz(arr,left,dlen);
                    }else{
                        if(arr[right]>=arr[left]&&arr[right]>=arr[index]){
                            let a=arr[index];
                            arr[index]=arr[right];
                            arr[right]=a;
                            tiaoz(arr,right,dlen);
                        }
                    }
                }
            }
        
        function goud(arr){
            var index=parseInt((arr.length-1)/2);
            for(var i=index;i>=0;i--){
                tiaoz(arr,i,arr.length);
            }
        }
        function dsort(arr){
            goud(arr);
            //console.log(1);   
            var len=arr.length;
            for(var i=0;i<arr.length;i++){
                let a=arr[0];
                arr[0]=arr[len-1];
                arr[len-1]=a;
                console.log(':',arr);
                len-=1;
                tiaoz(arr,0,len);
                
              // console.log(arr);
            }
            return arr;
        }
