// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { ArrowBgFill16, Plus12 } from '@mysten/icons';
import * as CollapsiblePrimitive from '@radix-ui/react-collapsible';
import { toast } from 'react-hot-toast';
import { type AccountType, type SerializedUIAccount } from '_src/background/accounts/Account';
import { isZkAccountSerializedUI } from '_src/background/accounts/zk/ZkAccount';
import { type ZkProvider } from '_src/background/accounts/zk/providers';
import { AccountIcon } from '_src/ui/app/components/accounts/AccountIcon';
import { AccountItem } from '_src/ui/app/components/accounts/AccountItem';
import { useCreateAccountsMutation } from '_src/ui/app/hooks/useCreateAccountMutation';
import { Heading } from '_src/ui/app/shared/heading';
import { Text } from '_src/ui/app/shared/text';
import { ButtonOrLink, type ButtonOrLinkProps } from '_src/ui/app/shared/utils/ButtonOrLink';

const accountTypeToLabel: Record<AccountType, string> = {
	'mnemonic-derived': 'Passphrase Derived',
	qredo: 'Qredo',
	imported: 'Imported',
	ledger: 'Ledger',
	zk: 'zkLogin',
};

const providerToLabel: Record<ZkProvider, string> = {
	google: 'Google',
};

// todo: we probbaly have some duplication here with the various FooterLink / ButtonOrLink
// components - we should look to add these to base components somewhere
function FooterLink({ children, to, ...props }: ButtonOrLinkProps) {
	return (
		<ButtonOrLink
			className="text-hero-darkest/40 no-underline uppercase hover:text-hero"
			to={to}
			{...props}
		>
			<Text variant="captionSmallExtra" weight="medium">
				{children}
			</Text>
		</ButtonOrLink>
	);
}

// todo: this is slightly different than the account footer in the AccountsList - look to consolidate :(
function AccountFooter({ accountID }: { accountID: string }) {
	return (
		<div className="flex flex-shrink-0 w-full">
			<div className="flex gap-3">
				<div className="w-4" />
				<FooterLink to={`/accounts/edit/${accountID}`}>Edit Nickname</FooterLink>
				<FooterLink to="/remove">Remove</FooterLink>
			</div>
		</div>
	);
}

export function AccountGroup({
	accounts,
	type,
	accountSource,
}: {
	accounts: SerializedUIAccount[];
	type: AccountType;
	accountSource?: string;
}) {
	const createAccountMutation = useCreateAccountsMutation();
	const showCreateNewButton = type === 'mnemonic-derived';
	return (
		<CollapsiblePrimitive.Root defaultOpen={true} asChild>
			<div className="flex flex-col gap-4 h-full w-full ">
				<CollapsiblePrimitive.Trigger asChild>
					<div className="flex gap-2 w-full items-center justify-center cursor-pointer flex-shrink-0 group [&>*]:select-none">
						<ArrowBgFill16 className="h-4 w-4 group-data-[state=open]:rotate-90 text-hero-darkest/20" />
						<Heading variant="heading5" weight="semibold" color="steel-darker">
							{/* TODO: revisit this logic for determining account provider */}
							{isZkAccountSerializedUI(accounts[0])
								? providerToLabel[accounts[0]?.provider] ?? 'zkLogin'
								: accountTypeToLabel[type]}
						</Heading>
						<div className="h-px bg-gray-45 flex flex-1 flex-shrink-0" />
						{showCreateNewButton ? (
							<ButtonOrLink
								onClick={async (e) => {
									// prevent the collapsible from closing when clicking the "new" button
									e.stopPropagation();
									try {
										if (type === 'mnemonic-derived' && accountSource) {
											await createAccountMutation.mutateAsync({
												sourceID: accountSource,
												type: 'mnemonic-derived',
											});
										}
									} catch (e) {
										toast.error((e as Error).message || 'Failed to create new account');
									}
								}}
								className="items-center justify-center gap-0.5 cursor-pointer appearance-none uppercase flex bg-transparent border-0 outline-none text-hero hover:text-hero-darkest"
							>
								<Plus12 />
								<Text variant="bodySmall" weight="semibold">
									New
								</Text>
							</ButtonOrLink>
						) : null}
					</div>
				</CollapsiblePrimitive.Trigger>
				<CollapsiblePrimitive.CollapsibleContent asChild>
					<div className="flex flex-col gap-3 w-full flex-shrink-0">
						{accounts.map((account) => {
							return (
								<AccountItem
									key={account.id}
									background="gradient"
									address={account.address}
									icon={<AccountIcon account={account} />}
									after={<AccountFooter accountID={account.id} />}
								/>
							);
						})}
					</div>
				</CollapsiblePrimitive.CollapsibleContent>
			</div>
		</CollapsiblePrimitive.Root>
	);
}