/* (C) 2020 - FreightTrust and Clearing Corporation
 * SPDX: MPL-2.0
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

$.jsonRPC.setup({
  endPoint: 'http://'+window.location.hostname+':8000/',
  namespace: 'freightlayer'
});

freightlayer = {};
freightlayer.client = {};
freightlayer.client.msgcount = -1;
freightlayer.client.sentcount = -1;

freightlayer.client.checkBalance = function() {
	$.jsonRPC.request('getBalance',{
	   params:[],   
	  success: function(result) {
		if(result.result<314625637462307939) {
			$('#balancealert').show();
		}		 
	  },
	  error: function(result) {
		console.log("ERROR",result);
	  }
	});

}
freightlayer.client.receivedMessageCount = function() {
	$.jsonRPC.request('receivedMessageCount',{
	   params:[],   
	  success: function(result) {
		 if(result.result!=freightlayer.client.msgcount) {
			 freightlayer.client.msgcount=result.result;
			 freightlayer.client.updateMsgList();
			 $('.receivedMessageCount').text(result.result);
		 }		 
	  },
	  error: function(result) {
		console.log("ERROR",result);
	  }
	});
	$.jsonRPC.request('sentMessageCount',{
	   params:[],   
	  success: function(result) {
		 if(result.result!=freightlayer.client.sentcount) {
			 freightlayer.client.sentcount=result.result;
			 freightlayer.client.updateSentList();
			 $('.sentMessageCount').text(result.result);
		 }		 
	  },
	  error: function(result) {
		console.log("ERROR",result);
	  }
	});
	freightlayer.client.checkBalance();
};
freightlayer.client.ediModal=function(num) {	
	$.jsonRPC.request('getMessageByNumber',{
			params:[num],
			success:function(result) { 	
					console.log(result);
					if(!result.result.content) {
						setTimeout(freightlayer.client.ediModal(num),2000);
					} else {
						$('#ediPRE').text(result.result.content.edi);
					}
			
			},
			error:function(result) {}
	});
};
freightlayer.client.ackModal=function(num) {
	$.jsonRPC.request('getSentByNumber',{
			params:[num],
			success:function(result) { 						
					if(!result.result.aperak) {
						setTimeout(freightlayer.client.ackModal(num),2000);
					} else {
						$('#ediPRE').text(result.result.aperak);
					}
			
			},
			error:function(result) {}
	});
}


freightlayer.client.updateTxLog = function() {
	$.jsonRPC.request('getTxLog',{
			params:[],
			success:function(result) { 
					var html="<tr><th>Sent</th><th>Type</th><th>FreightTrustNetwork211</th><th>To/Addr</th><th>Hash</th></tr>";
					for(var i=0;i<result.result.file.length;i++) {
							html+="<tr><td>"+result.result.file[i].timestamp+"</td>";
							var message="other";
							if(result.result.file[i].message=="ackMsg") message="CONTRL/APERAK";
							if(result.result.file[i].message=="sendMsg") message="EDI";
							if(result.result.file[i].message=="register") message="REGISTRATION";
							html+="<td title='"+result.result.file[i].message+"'>"+message+"</td>";
							html+="<td><a href='http://18.216.213.235:25000/tx/"+result.result.file[i].result+"' target='_blank' title='"+result.result.file[i].result+"'>"+result.result.file[i].result.substr(0,15)+"...</a></td>";
							if(result.result.file[i].to) html+="<td><a href='http://18.216.213.235:25000/address/"+result.result.file[i].to+"' target='_blank' title='"+result.result.file[i].to+"'>"+result.result.file[i].to.substr(0,15)+"</a></td>"; else if(result.result.file[i].addr) html+="<td><a href='http://18.216.213.235:25000/address/"+result.result.file[i].addr+"' target='_blank' title='"+result.result.file[i].addr+"'>"+result.result.file[i].addr.substr(0,15)+"</a></td>"; else html+="<td>-</td>";;
							if(result.result.file[i].hash) html+="<td><a href='https://gateway.ipfs.io/ipfs/"+result.result.file[i].hash+"' target='_blank' title='"+result.result.file[i].hash+"'>"+result.result.file[i].hash.substr(0,15)+"</a></td>"; else html+="<td>-</td>";
							html+="<td><span id='tx"+result.result.file[i].result+"'></span></td>";							
					}		
					$('#outlist').html(html);
			},
			error:function(result) {}
	});
	

}
freightlayer.client.updateMsgList = function() {
		var html="<tr><th>Sent</th><th>Message Contract Address</th><th>From Account Address</th><th>Message Hash</th><th>Contrl/Aperak</th><th>Actions</th></tr>";
		for(var i=freightlayer.client.msgcount-1;((i>=0)&&(i>freightlayer.client.msgcount-10));i--) {
				html+="<tr><td id='msgtime"+i+"'>loading</td><td id='msgadr"+i+"'></td><td id='msgfrom"+i+"'></td><td id='msghash"+i+"'></td><td id='msgctrl"+i+"'></td><td id='msgactions"+i+"'></td></tr>";				
				$.jsonRPC.request('getMessageByNumber',{
				   id:i,
				   params:[i],   
				  success: function(result) {						 
					 $('#msgtime'+result.id).html(new Date(result.result.timestamp_msg*1000).toLocaleDateString()+" "+new Date(result.result.timestamp_msg*1000).toLocaleTimeString());
					 $('#msgadr'+result.id).html("<a href='http://18.216.213.235:25000/address/"+result.result.addr+"' target='_blank' title='"+result.result.addr+"'>"+result.result.addr.substr(0,15)+"...</a>");
					 $('#msgfrom'+result.id).html("<a href='http://18.216.213.235:25000/address/"+result.result.from+"' target='_blank' title='"+result.result.from+"'>"+result.result.from.substr(0,15)+"...</a>");
					 $('#msghash'+result.id).html("<a href='https://gateway.ipfs.io/ipfs/"+result.result.hash_msg+"' target='_blank' title='"+result.result.hash_msg+"'>"+result.result.hash_msg.substr(0,15)+"...</a>"); 
					 if(result.result.timestamp_ack>1) {
						$('#msgctrl'+result.id).html(new Date(result.result.timestamp_ack*1000).toLocaleDateString()+" "+new Date(result.result.timestamp_ack*1000).toLocaleTimeString());
					 } else {
						$('#msgctrl'+result.id).html("<button class='btn btn-default btnaperak' id='actaperk"+result.id+"'>CONTRL/APERAK</button>");
						$('#actaperk'+result.id).on('click',function(e) {
								$('#txtAPERAK').val("");
								$('#aperakModal').attr('data-num',result.id);
								$('#aperakModal').attr('data-address',result.result.addr);
								$('#aperakModal').modal('show');									
						});
					 }					 
					 
					 $('#msgactions'+result.id).html("<button class='btn btn-success actedi' id='actedi"+result.id+"' data='"+result.id+"'>EDI</button>");
					 $('#actedi'+result.id).on('click',function(e) {
									$('#ediModal').modal('show');
									var edi="Decrypting...";
									$('#ediPRE').text(edi);
									$.jsonRPC.request('decryptMessageByNumber',{											
											params:[$(e.toElement).attr('data')],   
											success: function(result) {												
												freightlayer.client.ediModal($(e.toElement).attr('data'));
											},
											error: function(result) {
											}
									});									
					});
				  },
				  error: function(result) {
					console.log("ERROR",result);
				  }
				});
		}				
		$('#inlist').html(html);
};

freightlayer.client.updateSentList = function() {
		var html="<tr><th>Sent</th><th>Message Contract Address</th><th>To Account Address</th><th>Message Hash</th><th>Contrl/Aperak</th><th>Actions</th></tr>";
		for(var i=freightlayer.client.sentcount-1;((i>=0)&&(i>freightlayer.client.sentcount-10));i--) {
				html+="<tr><td id='senttime"+i+"'>loading</td><td id='sentadr"+i+"'></td><td id='sentto"+i+"'></td><td id='senthash"+i+"'></td><td id='sentctrl"+i+"'></td><td id='sentactions"+i+"'></td></tr>";				
				$.jsonRPC.request('getSentByNumber',{
				   id:i,
				   params:[i],   
				  success: function(result) {	
					if(!result.result) return;			  
					 $('#senttime'+result.id).html(new Date(result.result.timestamp_msg*1000).toLocaleDateString()+" "+new Date(result.result.timestamp_msg*1000).toLocaleTimeString());
					 $('#sentadr'+result.id).html("<a href='http://18.216.213.235:25000/address/"+result.result.addr+"' target='_blank' title='"+result.result.addr+"'>"+result.result.addr.substr(0,15)+"...</a>");
					 $('#sentto'+result.id).html("<a href='http://18.216.213.235:25000/address/"+result.result.to+"' target='_blank' title='"+result.result.to+"'>"+result.result.to.substr(0,15)+"...</a>");
					 $('#senthash'+result.id).html("<a href='https://gateway.ipfs.io/ipfs/"+result.result.hash_msg+"' target='_blank' title='"+result.result.hash_msg+"'>"+result.result.hash_msg.substr(0,15)+"...</a>"); 
					 if(result.result.timestamp_ack>1) {
						$('#sentctrl'+result.id).html(new Date(result.result.timestamp_ack*1000).toLocaleDateString()+" "+new Date(result.result.timestamp_ack*1000).toLocaleTimeString());
					 } else {
						$('#sentctrl'+result.id).html("-");						
					 }					 					 
					 if(result.result.timestamp_ack>1) {
						$('#sentactions'+result.id).html("<button class='btn btn-success actcontrl' id='actcontrl"+result.id+"' data='"+result.id+"'>CONTRL/APERAK</button>");
					 } else {}
					 $('#actcontrl'+result.id).on('click',function(e) {
									$('#ediModal').modal('show');
									var edi="Decrypting...";
									$('#ediPRE').text(edi);
									$.jsonRPC.request('decryptSentByNumber',{											
											params:[$(e.toElement).attr('data')],   
											success: function(result) {												
												freightlayer.client.ackModal($(e.toElement).attr('data'));																						
											},
											error: function(result) {
											}
									});									
					});
					
				  },
				  error: function(result) {
					console.log("ERROR",result);
				  }
				});
		}				
		$('#sentlist').html(html);
};

$('#sendAperak').on('click',function() {
	$('#actaperk'+$('#aperakModal').attr('data-num')).attr('disabled',true);

	$.jsonRPC.request('ackMessageByAddr',{
	   params:[$('#aperakModal').attr('data-address'),$('#txtAPERAK').val()],   
	  success: function(result) {
		 		 
	  },
	  error: function(result) {
		console.log("ERROR",result);
	  }
	});
});
$('#sendEdi').on('click',function()  {	
	$.jsonRPC.request('sendEdi',{
	  params:[$('#txtNEDI').val()],   
	  success: function(result) {
		 		 
	  },
	  error: function(result) {
		console.log("ERROR",result);
	  }
	});
});

$.jsonRPC.request('chainAccount',{
	   params:[],   
	  success: function(result) {
		 $('#nbAcctDD').text(result.result);
		$('#chargelink').attr("href","https://www.bidesk.com/exchange/EDI/USDT"+result.result);
	  },
	  error: function(result) {
		console.log("ERROR",result);
	  }
});
$('#btnNewEDI').on('click',function() {
	$('#txtNEDI').val('');
	$('#nediModal').modal('show');	
});

freightlayer.client.receivedMessageCount();
freightlayer.client.updateTxLog();
setInterval(function() {freightlayer.client.receivedMessageCount()},15000);


