import { BrowserRouter,Route, Routes } from "react-router-dom";
import React, { useRef,createContext, useContext, useState , useEffect,lazy,Suspense} from 'react';
import { MyContext } from './DataContext';
// import Login from './Login'
// import Signup from './Signup'
// import Homepage from "./Homepage";
// import AuthPage from "./AuthPage";
// import ProfilePage from "./ProfilePage";
// import HelpNote from "./HelpNote";
// import AboutPage from "./AboutPage";
// import TermsandConditions from "./TermsandConditions";
// import SuperAdminPage from "./SuperAdminPage";
// import SupadAdminManage from "./SupadAdminManage";
// import SupadStudentManage from "./SupadStudentManage";
// import SupadIdRegister from "./SupadIdRegister";
// import SupadLoginRecord from "./SupadLoginRecord";
// import LandingPage from "./LandingPage";
// import ContactUs from "./ContactUs";
// import FAQs from "./FAQs";
// import GameCreateSelect from "./GameCreateSelect";
// import GrammarCreateView from "./GrammarCreateView";
// import GrammarCreate from "./GrammarCreate";

// import Analytics from "./Analytics";
// import HostPlayroom from "./HostPlayroom";
// import HostCreatePlayroom from "./HostCreatePlayroom";
// import SpellCreateSelect from "./SpellCreateSelect";
// import SpellCreate from "./SpellCreate";
// import ReadingCreate from "./ReadingCreate";
// import ReadingCreateView from "./ReadingCreateView";
// import HostViewPlayroom from "./HostViewPlayroom";



import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import SuperAdminRoute from "./SuperAdminRoute";
import Homepage from "./Homepage";
import GameCreateSelect from "./GameCreateSelect";
import Leaderboards from "./Leaderboards";


const Login = lazy(() => import('./Login'));
const Signup = lazy(() => import('./Signup'));
const AuthPage = lazy(() => import("./AuthPage"));
const ProfilePage = lazy(() => import("./ProfilePage"));
const HelpNote = lazy(() => import("./HelpNote"));
const AboutPage = lazy(() => import("./AboutPage"));
const TermsandConditions = lazy(() => import("./TermsandConditions"));
const SuperAdminPage = lazy(() => import("./SuperAdminPage"));
const SupadAdminManage = lazy(() => import("./SupadAdminManage"));
const SupadStudentManage = lazy(() => import("./SupadStudentManage"));
const SupadIdRegister = lazy(() => import("./SupadIdRegister"));
const SupadLoginRecord = lazy(() => import("./SupadLoginRecord"));
const LandingPage = lazy(() => import("./LandingPage"));
const ContactUs = lazy(() => import("./ContactUs"));
const FAQs = lazy(() => import("./FAQs"));
const GrammarCreateView = lazy(() => import("./GrammarCreateView"));
const GrammarCreate = lazy(() => import("./GrammarCreate"));
const Analytics = lazy(() => import("./Analytics"));
const HostPlayroom = lazy(() => import("./HostPlayroom"));
const HostCreatePlayroom = lazy(() => import("./HostCreatePlayroom"));
const SpellCreateSelect = lazy(() => import("./SpellCreateSelect"));
const SpellCreate = lazy(() => import("./SpellCreate"));
const ReadingCreate = lazy(() => import("./ReadingCreate"));
const ReadingCreateView = lazy(() => import("./ReadingCreateView"));
const HostViewPlayroom = lazy(() => import("./HostViewPlayroom"));


const WebController = ()=>{

  const {ProfileActive,setProfileActive}=useContext(MyContext)

  //local load session for profile active
  useEffect(()=>{
    //for profile 
    if( localStorage.getItem("profile_active") !== null){
   setProfileActive(JSON.parse(localStorage.getItem("profile_active")))
    }
    },[])

  const LoadingFallback = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    width: '100%',
    backgroundColor: '#f8f9fa',
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: 9999
  }}>
    <div style={{
      textAlign: 'center'
    }}>
      <div style={{
        width: '60px',
        height: '60px',
        border: '6px solid #f3f3f3',
        borderTop: '6px solid #6c4d4d',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        margin: '0 auto'
      }}></div>
      <p style={{
        marginTop: '20px',
        color: '#6c4d4d',
        fontSize: '16px',
        fontWeight: '500'
      }}>Loading...</p>
    </div>
    <style>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);
  

    return(
        <>


        <BrowserRouter>
         <Suspense fallback={<LoadingFallback />}>
            <Routes>
               
                <Route path = '/' element={<LandingPage/>}></Route>
                 
                 <Route path = '/Login' element={   
                  <PublicRoute>
                 <Login/>
                 </PublicRoute>
                 }>
                  
                 </Route>
                 
                <Route path = '/Signup' element={<Signup/>}></Route>


                <Route path = '/Homepage' element={
                  <ProtectedRoute>
                <Homepage/>
                 </ProtectedRoute>
                }></Route>

                
                <Route path = '/AuthPage' element={<AuthPage/>}></Route>

                <Route path = '/ProfilePage' element={
                  <ProtectedRoute>
                <ProfilePage/>
                </ProtectedRoute>
                }></Route>
                 
                  <Route path = '/HelpNote' element = {<HelpNote/>}></Route>
                   <Route path = '/AboutPage' element = {<AboutPage/>}></Route>
                     <Route path = '/TermsandCondtions' element = {<TermsandConditions/>}></Route>

                     <Route path = '/SuperAdminPage' element = {
                      <SuperAdminRoute>
                     <SuperAdminPage/>
                     </SuperAdminRoute>
                     }></Route>

                     <Route path = '/SupadAdminManage' element = {
                      <SuperAdminRoute>
                     <SupadAdminManage/>
                    </SuperAdminRoute>
                     }></Route>

                      <Route path = '/SupadStudentManage' element = {
                        <SuperAdminRoute>
                      <SupadStudentManage/>
                       </SuperAdminRoute>
                      }></Route>

                       <Route path = '/SupadIdRegister' element = {
                        <SuperAdminRoute>
                       <SupadIdRegister/>
                        </SuperAdminRoute>
                       }></Route>

                       <Route path = '/SupadLoginRecord' element = {
                        <SuperAdminRoute>
                       <SupadLoginRecord/>
                      </SuperAdminRoute>
                       }></Route>

                       <Route path = '/ContactUs' element = {<ContactUs/>}></Route>
                       <Route path = '/FAQs' element = {<FAQs/>}></Route>

                       <Route path = '/GameCreateSelect' element = {
                        <ProtectedRoute>
                       <GameCreateSelect/>
                       </ProtectedRoute>}></Route>

                        <Route path = '/GrammarCreateView' element = {
                          <ProtectedRoute>
                        <GrammarCreateView/>
                        </ProtectedRoute>}></Route>

                         <Route path = '/GrammarCreate' element = {
                          <ProtectedRoute>
                         <GrammarCreate/>
                         </ProtectedRoute>}></Route>

                         <Route path = '/Leaderboards' element={
                          <ProtectedRoute>
                         <Leaderboards/>
                         </ProtectedRoute>}></Route>

                         <Route path = '/Analytics' element={
                          <ProtectedRoute>
                         <Analytics/>
                         </ProtectedRoute>}></Route>

                         <Route path = '/HostPlayroom' element={
                          <ProtectedRoute>
                         <HostPlayroom/>
                         </ProtectedRoute>}></Route>

                           <Route path = '/HostCreatePlayroom' element={
                            <ProtectedRoute>
                           <HostCreatePlayroom/>
                           </ProtectedRoute>}></Route>

                            <Route path = '/SpellCreateSelect' element={
                              <ProtectedRoute>
                            <SpellCreateSelect/>
                            </ProtectedRoute>}></Route>

                             <Route path = '/SpellCreate' element={
                              <ProtectedRoute>
                             <SpellCreate/>
                             </ProtectedRoute>}></Route>


                              <Route path = '/ReadingCreate' element={
                                <ProtectedRoute>
                              <ReadingCreate/>
                              </ProtectedRoute>}></Route>

                                <Route path = '/ReadingCreateView' element={
                                  <ProtectedRoute>
                                <ReadingCreateView/>
                                </ProtectedRoute>}></Route>

                                  <Route path = '/HostViewPlayroom' element={
                                    <ProtectedRoute>
                                  <HostViewPlayroom/>
                                  </ProtectedRoute>}></Route>
            </Routes>
            </Suspense>
        </BrowserRouter>

        </>
    )
}

export default WebController;