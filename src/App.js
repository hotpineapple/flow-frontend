import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
function App() {
  const [ fixedExtensionList, setFixedExtensionList ] = useState([]);
  const [ customExtensionList, setCustomExtensionList ] = useState([]);
  const [ keyword, setKeyword ] = useState('');
  const [ sortBy, setSortBy ] = useState('added_at');
  const [ sortOrder, setSortOrder ] = useState('asc');
  const baseUrl = process.env.SERVER_URL;
  const totalCustomExtensionCnt = 200;
  
  useEffect(()=>{
    getFixedExtensionList();
  },[]);

  useEffect(()=>{
    getCustomExtensionList();
  },[sortBy, sortOrder]);
  
  const getFixedExtensionList = async () => {
    const { data } = await axios.get(baseUrl+"/extension/fixed");
    setFixedExtensionList(data);
  }
  const getCustomExtensionList = async () => {
    const { data } = await axios.get(baseUrl+`/extension/custom?sortBy=${sortBy}&sortOrder=${sortOrder}`);
    setCustomExtensionList(data.result);

  }
  const handleFixedExtension = async (event, name) => {
    if(event.target.checked){
      try {
        await axios.patch(baseUrl+"/extension/fixed", {
          name,
          isBlocked: true
        });
      } catch(e) {
        if(e.response.status === 304) alert("처리된 요청입니다.");
        else if(e.response.status === 400) alert("잘못된 요청 파라미터 입니다.");
        else {
          alert("서버오류가 발생했습니다");
        }
      }
    } else{
      try {
        await axios.patch(baseUrl+"/extension/fixed",{
          name,
          isBlocked: false
        });
      } catch(e) {
        if(e.response.status === 304) alert("처리된 요청입니다.");
        else if(e.response.status === 400) alert("잘못된 요청 파라미터 입니다.");
        else {
          alert("서버오류가 발생했습니다");
        }
      }
    }
    getFixedExtensionList();
  }
  const addCustomExtension = async () => {
    if(keyword.length > 20 || keyword.length === 0) {
      alert('커스텀 확장자는 1 ~ 20자 입력가능합니다.');
      return;
    }
    else if(customExtensionList.length === 200){
      alert('커스텀 확장자는 최대 200개까지 등록가능합니다.');
      return;
    }
    try{
      await axios.post(baseUrl+`/extension/custom/${keyword}`);
      getCustomExtensionList();
    } catch(e) {
      if(e.response.status === 304) alert("이미 등록된 확장자입니다.");
      else if(e.response.status === 400) alert("잘못된 요청 파라미터 입니다.");
      else alert("잘못된 요청 파라미터 입니다.");
    }
    
  }
  const deleteCustomExtension = async name => {
    try {
      await axios.delete(baseUrl+`/extension/custom/${name}`);
      getCustomExtensionList();
    } catch(e) {
      if(e.response.status === 400) alert("잘못된 요청 파라미터 입니다.");
      else if(e.response.status === 404) alert("존재하지 않는 커스텀 확장자입니다");
      else alert("잘못된 요청 파라미터 입니다.");
    }
    
  }
  return (
    <div className='wrapper'>
      <h1>파일확장자 차단</h1>
      <hr/>
      <h4>고정 확장자</h4>
      {fixedExtensionList.map(item => <span key={item.name}><input type="checkbox" checked={item.blocked} onChange={(event)=>handleFixedExtension(event, item.name)}/>{item.name}</span>)}
      <h4>커스텀 확장자</h4>
        <div className='inputNselectBox'>
          <input onChange={(e)=>setKeyword(e.target.value)} placeholder="확장자 입력"></input>&nbsp;
          <button onClick={()=>addCustomExtension()}>추가</button>
          <div className='sortBox'>
            <select defaultValue='added_at' onChange={(e)=>setSortBy(e.target.value)}>
              <option value="name">확장자명</option>
              <option value="added_at">추가시각</option>
            </select>&nbsp;
            <select defaultValue='asc' onChange={(e)=>setSortOrder(e.target.value)}>
              <option value="asc">오름차순</option>
              <option value="desc">내림차순</option>
            </select>
          </div>
        </div>
        <div className='customExtensionBox'>
          <div className='customExtensionCntBox'>{customExtensionList.length}/{totalCustomExtensionCnt}</div>
          {customExtensionList.map(item => <span className='customExtension' key={item.name}>{item.name}<button className='customExtensionDeleteBtn' onClick={()=>deleteCustomExtension(item.name)}>X</button></span>)}
        </div>
    </div>
  );
}

export default App;
