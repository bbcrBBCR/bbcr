//非常粗糙的比较两个dom结点的方法，比较了属性以及文本节点的内容。
function diff(domnode1,domnode2){
            var queue1=[domnode1],queue2=[domnode2];
            while(queue1.length!==0&&queue2.length!==0){
                console.log(1);
                var node1=queue1.shift(),
                    node2=queue2.shift();
                if(node1.nodeType!==node2.nodeType){
                    return false;
                }else{
                    if(node1.nodeType==1||node1.nodeType==9){
                        var node1attr=node1.attributes,
                            node2attr=node2.attributes;
                        if(node1attr.length!==node2attr.length){
                            return false;
                        }
                        for(var i=0;i<node1attr.length;i++){
                            var attrnode1=node1attr.item(i);
                            if(node2attr.getNamedItem(attrnode1.nodeName)===null){
                                return false;
                            }
                            if(node2attr.getNamedItem(attrnode1.nodeName).nodeValue!==attrnode1.nodeValue){
                                return false;
                            }
                        }
                        queue1.push(... node1.childNodes);
                        queue2.push(... node2.childNodes);
                    }else{
                        if(node1.nodeType==3){
                            if(node1.nodeValue!==node2.nodeValue){
                                return false;
                            }
                        }
                    }
                }
            }
            return true;
        }
