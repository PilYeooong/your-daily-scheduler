import React, { useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { RootState } from '../../reducers';
import { cities } from '../../utils/constants';
import { resetDoneStateAction, updateProfileRequestAction } from '../../actions';
import { Container, Form, Input, InputBox, Submit } from '../../styles/AuthForm/styles';
import { SelectCity } from './styles';
import Loading from '../../components/Loading';

interface IProfileForm {
  email: string;
  password: string;
  passwordCheck: string;
  city: string;
}

const Profile: React.FC = () => {
  const dispatch = useDispatch();
  const me = useSelector((state: RootState) => state.user.me);

  const updateProfileLoading = useSelector((state: RootState) => state.user.updateProfileLoading);
  const updateProfileDone = useSelector((state: RootState) => state.user.updateProfileDone);
  const updateProfileError = useSelector((state: RootState) => state.user.updateProfileError);

  const { register, getValues, handleSubmit } = useForm<IProfileForm>({
    mode: 'onChange',
  });

  useEffect(() => {
    if (updateProfileDone) {
      toast.success('프로필을 수정하였습니다.', {
        position: toast.POSITION.TOP_CENTER,
      });
      dispatch(resetDoneStateAction());
    }
    if (updateProfileError) {
      toast.error('프로필 수정에 실패하였습니다.', {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  }, [updateProfileDone, dispatch]);

  const onSubmit = useCallback(() => {
    const { email, password, passwordCheck, city } = getValues();
    if (password) {
      if (password !== passwordCheck) {
        toast.error('입력하신 비밀번호가 서로 일치하지 않습니다.', {
          position: toast.POSITION.TOP_CENTER,
        });
        return;
      }
    }
    dispatch(updateProfileRequestAction({ email, password, passwordCheck, city }));
  }, [getValues, dispatch]);

  return (
    <Container>
      <Helmet>
        <title>PROFILE | YDS</title>
      </Helmet>
      {!me ? null : (
        <Form onSubmit={handleSubmit(onSubmit)}>
          <InputBox>
            <Input
              ref={register()}
              name="email"
              type="text"
              disabled
              defaultValue={me.email}
              placeholder="이메일"
            />
          </InputBox>
          <InputBox>
            <Input ref={register()} name="password" type="password" placeholder="새 비밀번호" />
          </InputBox>
          <InputBox>
            <Input
              ref={register()}
              name="passwordCheck"
              type="password"
              placeholder="새 비밀번호 확인"
            />
          </InputBox>
          <InputBox>
            <SelectCity ref={register} name="city" defaultValue={me.city}>
              <option>-------</option>
              {cities.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </SelectCity>
          </InputBox>
          <Submit>
            {updateProfileLoading ? <Loading /> : <button type="submit">수정</button>}
          </Submit>
        </Form>
      )}
    </Container>
  );
};

export default Profile;
