
//각종 수치
let titleInfo = titlelist[0];
let audioObj = {};
let imageObj = {};
let result = {};//출력 틀 묶음
let textarea = $("#textarea");


//==================================
//※ 리소스 관련
//==================================
function setResource() {
    //오디오 세팅
    audiolist.forEach(function(x) {
        audioObj[x.name] = {};
        audioObj[x.name].url = x.url;
        if (x.start) audioObj[x.name].start = x.start;
    });
    //이미지 세팅
    imagelist.forEach(function(x) {
        imageObj[x.name] = x.url;
    });
}

function setAudio(elm, name) {
    if (audioObj[name]) {
        let videoid = audioObj[name].url.split("/")[4];
        let tempHref = audioObj[name].url + "?rel=0&controls=0&autoplay=1&loop=1&playlist=" + videoid;

        if (audioObj[name].start)
            tempHref += "&start=" + audioObj[name].start;
        else
            tempHref += "&start=0";

        $("#youtube").src = tempHref;
    }
}

function getImage(name) {
    return imageObj[name];
}

function setImage(target, name) {
    if (imageObj[name]) target.style.backgroundImage = "url(" + imageObj[name] + ")";
}


//==================================
//※ 틀 제작
//==================================
function generate_wrapper() {
    //선택지 틀
    result.selectframe = document.createElement("div");
        result.selectframe.id = "selectframe";

    result.selecthead = document.createElement("div");
        result.selecthead.id = "selecthead";

        result.selecthead.innerHTML = "선택하세요";

    result.cha3.appendChild(result.selectframe);
    result.selectframe.appendChild(result.selecthead);
}

//==================================
//※ 대사 & 버튼 & 선택지 제작
//==================================
function generate_script() {
    //타이틀 설정
    if (titleInfo.color) $("#titlescreen").style.backgroundColor = titleInfo.color;
    setImage($("#titlescreen"),titleInfo.background);
    if (titleInfo.title) $("#title").innerHTML = titleInfo.title;

    let nameArr = [];//이름 중복제작 방지
    script.forEach(function(data, num) {
        //이름 제작
        if (data.name.length > 0 && nameArr.indexOf(data.name) < 0) {
            nameArr.push(data.name);

            result["name_" + data.name] = document.createElement("span");
            nameElm = result["name_" + data.name];
            nameElm.id = "name_" + data.name;
            nameElm.style.display = "none";
            nameElm.innerHTML = data.name;

            $("#dialog_nameframe").appendChild(nameElm);
        }

        //대사 제작
        if (num === 0) {
            dialog_firsttextframe = document.createElement("div");
            dialog_firsttextframe.id = "dialog_firsttextframe";
            dialog_firsttextframe.style.height = "auto";
            dialog_firsttextframe.style.transition = "opacity 1s linear 2s";

            $("#dialog_textframe").appendChild(dialog_firsttextframe);
        }
        result["text_" + data.id] = document.createElement("div");
        textElm = result["text_" + data.id];
        textElm.id = "text_" + data.id;
        textElm.innerHTML = data.text;
        textElm.style.width = "0";
        textElm.style.height = "0";
        textElm.style.overflow = "hidden";
        textElm.style.opacity = "0.1";
        textElm.style.transition = "opacity 1s linear";
            //첫 대사는 길이 100%
            if (num === 0) {
                textElm.style.width = "100%";
                textElm.style.height = "100%";
                textElm.style.opacity = "1";
            }

        if (num === 0) {
            $("#dialog_firsttextframe").appendChild(textElm);
        } else {
            $("#dialog_textframe").appendChild(textElm);
        }

        //버튼 제작
        if (data.next !== "end") {
            result["button_" + data.id] = document.createElement("a");
            buttonElm = result["button_" + data.id];
            buttonElm.id = "button_" + data.id;
            buttonElm.className = "progress";

            buttonElm.href = "#";
            buttonElm.innerHTML = "다음 >>";

            $("#buttonframe").appendChild(buttonElm);
        } else {
            result["button_" + data.id] = document.createElement("div");
            buttonElm = result["button_" + data.id];
            buttonElm.id = "button_" + data.id;
            buttonElm.className = "end";
            buttonElm.style.display = "none";

            buttonElm.innerHTML = "- 끝 -";

            $("#buttonframe").appendChild(buttonElm);
        }

        //선택지 제작

    })
}

//==================================
//※ 상호작용
//==================================
function generate_interact() {
    //가동 버튼 상호작용
    $("#noticebutton").onclick = function() {
        //화면 전환
        $("#noticebutton").style.display = "none";
        $("#noticescreen").style.display = "none";
        $("#titlescreen").style.display = "block";
            void $("#titlescreen").offsetWidth;
            $("#titlescreen").style.opacity = "1";
        $("#start").style.display = "block";

        //음악 출력
        setAudio($("#noticebutton"),titleInfo.audio);
    }

    //시작 버튼 상호작용
    $("#start").onclick = function() {
        let line = script[0];//첫 줄 세팅
        //화면 전환 & 첫 화면 구성
        $("#start").style.display = "none";
        $("#titlescreen").style.opacity = "0.1";
        setTimeout(function() {
            $("#titlescreen").style.display = "none";
            $("#mainscreen").style.display = "block";
        }, 2000);
        $("#dialog_firsttextframe").style.width = "100%";
        $("#dialog_firsttextframe").style.height = "auto";
        $("#dialog_firsttextframe").style.opacity = "1";

        //배경화면
        if (line.background === "none")
            $("#mainscreen").style.backgroundImage = "";
        else if (line.background !== "")
            $("#mainscreen").style.backgroundImage = "url(" + getImage(line.background) + ")";
        //이미지
        if (line.image1 === "none")
            $("#cha1").style.backgroundImage = "";
        else if (line.image1 !== "")
            $("#cha1").style.backgroundImage = "url(" + getImage(line.image1) + ")";
        if (line.image2 === "none")
            $("#cha2").style.backgroundImage = "";
        else if (line.image2 !== "")
            $("#cha2").style.backgroundImage = "url(" + getImage(line.image2) + ")";
        if (line.image3 === "none")
            $("#cha3").style.backgroundImage = "";
        else if (line.image3 !== "")
            $("#cha3").style.backgroundImage = "url(" + getImage(line.image3) + ")";
        //이름
        if (line.name !== "") {
            $("name_" + line.name).style.display = "block";
            $("#dialog_nameframe").style.visibility = "visible";
        } else {
            $("#dialog_nameframe").style.visibility = "hidden";

        }

        //다음 버튼
        setTimeout(function() {
            $("#button_" + line.id.toString()).style.display = "block";
        }, 2000);

        //음악 출력
        setAudio($("#start"), line.bgm);
    }

    //버튼 상호작용
    script.forEach(function(data, num) {
        let line;
        //next가 end가 아닌 경우에만 실시
        if (data.next === "end") return;

        $("#button_" + data.id).onclick = function() {
            //공통: 버튼 닫기
            $("#button_" + data.id).style.display = "none";
            $("#text_" + data.id).style.width = "0";
            $("#text_" + data.id).style.height = "0";
            $("#text_" + data.id).style.opacity = "0.1";

            //다음 대사 정하지 않음
            if (data.next === "") {
                line = script[num+1];
            //실행 종료 키워드
            } else if (data.next === "end") {
                //종료시키고 패스
                return;
            //다음 대사 정하지 않음
            } else {
                line = indexArrKey(script,"id",data.next);
            }

            //배경화면
            if (line.background === "none")
                $("#mainscreen").style.backgroundImage = "";
            else if (line.background !== "")
                $("#mainscreen").style.backgroundImage = "url(" + getImage(line.background) + ")";
            //이미지
            if (line.image1 === "none")
                $("#cha1").style.backgroundImage = "";
            else if (line.image1 !== "")
                $("#cha1").style.backgroundImage = "url(" + getImage(line.image1) + ")";
            if (line.image2 === "none")
                $("#cha2").style.backgroundImage = "";
            else if (line.image2 !== "")
                $("#cha2").style.backgroundImage = "url(" + getImage(line.image2) + ")";
            if (line.image3 === "none")
                $("#cha3").style.backgroundImage = "";
            else if (line.image3 !== "")
                $("#cha3").style.backgroundImage = "url(" + getImage(line.image3) + ")";
            //이름
            if (data.name !== "") {
                $("#name_" + data.name).style.display = "none";
                $("#dialog_nameframe").style.visibility = "hidden";
            }
            if (line.name !== "") {
                $("#name_" + line.name).style.display = "block";
                $("#dialog_nameframe").style.visibility = "visible";
            }

            //다음 대사
            if (line.text.length > 0) {
                $("#dialog_textframe").style.visibility = "visible";
                $("#text_" + line.id).style.width = "100%";
                $("#text_" + line.id).style.height = "100%";
                void $("#text_" + line.id).offsetWidth;
                $("#text_" + line.id).style.opacity = "1";
            } else {
                $("#dialog_textframe").style.visibility = "hidden";
            }
            //다음 버튼
            $("#button_" + line.id).style.display = "block";

            //음악 출력
            setAudio($("#button_" + data.id), line.bgm);
        }
    });

    //선택지 상호작용
}


//==================================
//※ 실행
//==================================
window.onload = function() {
    //리소스 세팅
    setResource();
    //대화 제작
    generate_script();
    //상호작용 제작
    generate_interact();
}
