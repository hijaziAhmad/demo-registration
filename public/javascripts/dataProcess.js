var reqData = ["nama", "ic", "bangsa", "address", "email", "mobile", "kelulusan", "bidangPelajaran", "pekerjaan", "bidangPekerjaan"]
var optionalData= ["negeri", "Parlimen", "Dun", "NamaPencadang", "noPencadang", "namaPenyokong", "noPenyokong"]

var collectedData={};
function checkData(){

    var flag=false;
    // check if all required field are answered.
    for (i in reqData){
        // console.log(reqData[i])
        var answer = document.getElementById(reqData[i]).value
        if (answer){
            document.getElementById(`${reqData[i]}required`).classList.remove("required")
            collectedData[reqData[i]]=answer
        }else{
            console.log(reqData[i], "is not answered.")
            scrollToEl(reqData[i]);
            document.getElementById(`${reqData[i]}required`).classList.add("required")
            flag=true;
            break;
        }
    }
    if (flag!=true){
        // collect additional data
        for (i in optionalData){
            console.log('collecting additional data', optionalData[i])
            var answer = document.getElementById(optionalData[i]).value
            collectedData[optionalData[i]]=answer;
            console.log(optionalData[i],'-->',answer)
        }
    }
    if (collectedData.length>=reqData.length||flag==false){
        console.log('checking agreement')
        // skip data collection
        // check agreement checked or not
        if (document.getElementById('agreement1').checked&&document.getElementById('agreement2').checked) {
            //check google recaptcha
            console.log('success')
            sentToSheet(collectedData)

        } else {
            document.getElementById(`agreementrequired`).classList.add("required")
        }
        
    }
}

function submitRequestToGoogleForm(input) {
    let submitTemp=`
    <div class="row request-container submit-container">
      <img class="submit-img" src="<%=url.img_root%>/complete.svg" loading="lazy">
      <div class="submit-container-text">
          <div class="submit-title">Request Submitted</div>
          <div class="submit-desc">Thank you for your requesting. We will be in touch soon!</div>
      </div>
    </div>
    `;

    let suggestionObj=input;
    suggestionObj.Time = todayDate();
    // record ref if any
    suggestionObj.ref= checkRef();
    // posting to google sheet
        AJAXRequest('POST','<%= url.requestHS %>', JSON.stringify(suggestionObj),
            function(res){
                    // if posting is successful.
                    console.log(res)
                document.getElementById("section3-contents").innerHTML=submitTemp;
            }, function(err){
                    // if posting is failed
                console.log(err);
        })
  }

  function AJAXRequest(type,url,body,onsuccess,onerror){
      var xmlhttp = new XMLHttpRequest();
      xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == XMLHttpRequest.DONE) {
          if (xmlhttp.status == 200) {
              onsuccess(JSON.parse(xmlhttp.responseText))
          }
          else if (xmlhttp.status == 400) {
              onerror(xmlhttp.response)
          }
          else {
              alert(xmlhttp.responseText);
          }
        }
      };
    xmlhttp.open(type,url,true);
    var ajaxBody=body|| '';
    xmlhttp.send(body);
  }


function sentToSheet(input){
    document.getElementById("RegistrationForm").style.display='none';
    document.getElementById("declaration").style.display='none';
    document.getElementById("respond").style.display='block';

    //sent via api here

    // posting to google sheet
        AJAXRequest('POST','https://script.google.com/macros/s/AKfycby26qHQISkHfxRYHY_nAnkOjSX_EA6P1v4V2fsxTtLopDG3e-k/exec', JSON.stringify(input),
            function(res){
                    // if posting is successful.
                    console.log(res)
                    document.getElementById('loaderIcon').innerHTML =`    <svg xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 128 128"width="254px" height="254px"
                    style=" fill:#000000;"><path fill="#fff" d="M64 16A48 48 0 1 0 64 112A48 48 0 1 0 64 16Z"></path><path fill="#31328B" d="M64 25A39 39 0 1 0 64 103A39 39 0 1 0 64 25Z"></path><path fill="none" stroke="#CD2A2D" stroke-miterlimit="10" stroke-width="6" d="M64 16A48 48 0 1 0 64 112A48 48 0 1 0 64 16Z"></path><path fill="none" stroke="#fff" stroke-linecap="round" stroke-miterlimit="10" stroke-width="6" d="M42 69L55.55 81 86 46"></path></svg>`
                    document.getElementById("loaderTitle").innerHTML="Terima kasih kerana mendaftar sebagai ahli!"
                    document.getElementById("loaderDesc").innerHTML="Sila tunggu 3-5 hari berkerja untuk pihak kami memproses maklumat anda."
            }, function(err){
                    // if posting is failed
                console.log(err);
            })

    // // to simulate success
    // setTimeout(()=>{
        
    // },3500)

}