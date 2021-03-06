import React, { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { loginRequestAction } from '../../actions';
import { RootState } from '../../reducers';
import Loading from '../../components/Loading';
import {
  Container,
  Form,
  InputBox,
  Input,
  Submit,
  ErrorMessage,
  LoginKeeper,
} from '../../styles/AuthForm/styles';
import KakaoLoginBtn from '../../components/SocialLogin/Kakao';
import GoogleLoginBtn from '../../components/SocialLogin/Google';

interface ILoginForm {
  email: string;
  password: string;
  loginKeeper: boolean;
}

const Login: React.FC = () => {
  const dispatch = useDispatch();
  const [loginKeeper, setLoginKeeper] = useState<boolean>(false);
  const loadMyInfoLoading = useSelector((state: RootState) => state.user.loadMyInfoLoading);
  const loginError = useSelector((state: RootState) => state.user.loginError);
  useEffect(() => {
    if (loginError) {
      toast.error(`${loginError}`, { position: toast.POSITION.TOP_CENTER });
    }
  }, [loginError]);

  const { register, getValues, errors, handleSubmit, formState } = useForm<ILoginForm>({
    mode: 'onChange',
  });

  const onChangeLoginKeeper = useCallback(() => {
    setLoginKeeper((prev) => !prev);
  }, []);

  const onSubmit = useCallback(() => {
    const { email, password } = getValues();
    dispatch(loginRequestAction(email, password, loginKeeper));
  }, [getValues, dispatch, loginKeeper]);

  return (
    <Container>
      <Helmet>
        <title>LOGIN | YDS</title>
      </Helmet>
      {loadMyInfoLoading ? (
        <Loading />
      ) : (
        <>
          <Form action="" onSubmit={handleSubmit(onSubmit)}>
            <InputBox>
              <Input
                ref={register({
                  required: '이메일을 입력 해주세요',
                  pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                })}
                type="email"
                name="email"
                placeholder="Email"
                required
              />
              {errors.email?.message && <ErrorMessage>{errors.email.message}</ErrorMessage>}
              {errors.email?.type === 'pattern' && (
                <ErrorMessage>유효한 이메일을 입력 해주세요</ErrorMessage>
              )}
            </InputBox>
            <InputBox>
              <Input
                ref={register({
                  required: '패스워드를 입력 해주세요',
                  minLength: 3,
                })}
                type="password"
                name="password"
                placeholder="Password"
                required
              />
              {errors.password?.message && <ErrorMessage>{errors.password.message}</ErrorMessage>}
              {errors.password?.type === 'minLength' && (
                <ErrorMessage>패스워드는 3자 이상 입력해주세요</ErrorMessage>
              )}
            </InputBox>
            <LoginKeeper>
              <input
                checked={loginKeeper}
                onChange={onChangeLoginKeeper}
                name="loginKeeper"
                type="checkbox"
              />
              <label>로그인 상태 유지</label>
            </LoginKeeper>
            <Submit>
              <button type="submit" className={formState.isValid ? 'clickable' : 'disabled'}>
                로그인
              </button>
            </Submit>
            <KakaoLoginBtn loginKeeper={loginKeeper} />
            <GoogleLoginBtn loginKeeper={loginKeeper} />
            <div className="link">
              계정이 없으신가요 ?<Link to="/signup">회원가입</Link>
            </div>
          </Form>
        </>
      )}
    </Container>
  );
};

export default Login;
