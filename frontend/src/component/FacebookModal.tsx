import React from 'react';
import './yesNoModal.scss';
import { useFormState } from 'react-use-form-state';

interface IYesNoModalProps {
  message: string;
  title: string;
  yes: (liveLoc: string, pageId?: string) => void;
  no: () => void;
}

const FacebookModal: React.FC<IYesNoModalProps> = (props) => {
  const [formState, { label, radio, text }] = useFormState(
    { liveLoc: 'user' },
    {
      withIds: true
    }
  );
  return (
    <>
      <div className="modal-background" onClick={props.no}></div>
      <div className="yes-no-modal mt-4" onClick={props.no}>
        <div
          className="modal-container"
          onClick={(event) => {
            event.stopPropagation();
          }}
        >
          <div className="modal-header">{props.title}</div>
          <div className="modal-message p-2">
            <div className="mb-2">{props.message}</div>
            <form>
              <div className="mb-1">
                <label {...label('liveLoc', 'user')}>User</label>
                <span className="pr-2">
                  <input {...radio('liveLoc', 'user')} />
                </span>
                <label {...label('liveLoc', 'page')}>Page</label>
                <span>
                  <input {...radio('liveLoc', 'page')} />
                </span>
              </div>
              {formState.values.liveLoc === 'page' && (
                <div>
                  <input {...text('pageId')} placeholder="PageId" required />
                </div>
              )}
            </form>
          </div>
          <div className="d-flex justify-content-end p-2">
            <div className="p-2">
              <button
                className="confirm mx-2 rounded-pill"
                disabled = {formState.values.liveLoc === 'page' && !formState.validity.pageId}
                onClick={() => {
                  if(formState.values.liveLoc === 'page') return props.yes(formState.values.liveLoc, formState.values.pageId);
                  if(formState.values.liveLoc === 'user') return props.yes(formState.values.liveLoc);
                }}
              >
                Confirm
              </button>
              <button className="mx-2 rounded-pill cancel" onClick={props.no}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FacebookModal;
