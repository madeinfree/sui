// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import cl from 'classnames';
import { memo, useCallback, useMemo, useState } from 'react';

import AccountAddress from '_components/account-address';
import ExternalLink from '_components/external-link';
import Icon from '_components/icon';
import LoadingIndicator from '_components/loading/LoadingIndicator';

import type { MouseEventHandler, ReactNode } from 'react';

import st from './UserApproveContainer.module.scss';

type UserApproveContainerProps = {
    children: ReactNode | ReactNode[];
    origin: string;
    originFavIcon?: string;
    rejectTitle: string;
    approveTitle: string;
    onSubmit: (approved: boolean) => void;
    isConnect?: boolean;
    isWarning?: boolean;
};

function UserApproveContainer({
    origin,
    originFavIcon,
    children,
    rejectTitle,
    approveTitle,
    onSubmit,
    isConnect,
    isWarning,
}: UserApproveContainerProps) {
    const [submitting, setSubmitting] = useState(false);
    const handleOnResponse = useCallback<MouseEventHandler<HTMLButtonElement>>(
        async (e) => {
            setSubmitting(true);
            const allowed = e.currentTarget.dataset.allow === 'true';
            await onSubmit(allowed);
            setSubmitting(false);
        },
        [onSubmit]
    );

    const parsedOrigin = useMemo(() => new URL(origin), [origin]);

    return (
        <div className={st.container}>
            <div className={st.scrollBody}>
                <div className={st.originContainer}>
                    <div className={st.originMeta}>
                        {originFavIcon ? (
                            <img
                                className={st.favIcon}
                                src={originFavIcon}
                                alt="Site favicon"
                            />
                        ) : null}
                        <div className={st.host}>
                            {parsedOrigin.host.split('.')[0]}
                            <ExternalLink
                                href={origin}
                                className={st.origin}
                                showIcon={false}
                            >
                                {parsedOrigin.host}
                            </ExternalLink>
                        </div>
                    </div>
                    <div className={st.cardFooter}>
                        <div className={st.label}>Your address</div>
                        <AccountAddress
                            showLink={false}
                            mode="normal"
                            copyable
                            className={st.address}
                        />
                    </div>
                </div>
                <div className={st.children}>{children}</div>
            </div>
            <div className={st.actionsContainer}>
                <div className={cl(st.actions, isWarning && st.flipActions)}>
                    <button
                        type="button"
                        data-allow="false"
                        onClick={handleOnResponse}
                        className={cl(
                            st.button,
                            isWarning
                                ? st.reject
                                : isConnect
                                ? st.cancel
                                : st.reject
                        )}
                        disabled={submitting}
                    >
                        {rejectTitle}
                    </button>
                    <button
                        type="button"
                        className={cl(
                            st.button,
                            isWarning ? st.cancel : st.approve,
                            submitting && st.loading
                        )}
                        data-allow="true"
                        onClick={handleOnResponse}
                        disabled={submitting}
                    >
                        <span>
                            {submitting ? (
                                <LoadingIndicator color="inherit" />
                            ) : (
                                approveTitle
                            )}
                        </span>
                        {isWarning && <Icon icon="arrow-right" />}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default memo(UserApproveContainer);
