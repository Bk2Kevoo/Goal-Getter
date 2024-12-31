import React from 'react';
import styled from 'styled-components';

const ExpenseCard = ({ expense }) => {
  const { description, amount, date, budget_id, created_at, updated_at } = expense;

  return (
    <Card>
      <Header>
        <Description>{description}</Description>
        <BudgetId>Budget ID: {budget_id}</BudgetId>
      </Header>
      <Body>
        <Amount>${amount.toFixed(2)}</Amount>
        <DateText><DateLabel>Date:</DateLabel> {new Date(date).toLocaleDateString()}</DateText>
        <DateText><DateLabel>Created:</DateLabel> {new Date(created_at).toLocaleString()}</DateText>
        <DateText><DateLabel>Last Updated:</DateLabel> {new Date(updated_at).toLocaleString()}</DateText>
      </Body>
    </Card>
  );
};

export default ExpenseCard;

const Card = styled.div`
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  margin: 10px;
  width: 300px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Description = styled.h3`
  font-size: 18px;
  font-weight: bold;
  margin: 0;
`;

const BudgetId = styled.p`
  font-size: 14px;
  color: #555;
`;

const Body = styled.div`
  margin-top: 10px;
`;

const Amount = styled.p`
  font-size: 16px;
  font-weight: bold;
  color: #2d88ff;
`;

const DateText = styled.p`
  font-size: 12px;
  color: #888;
`;

const DateLabel = styled.span`
  font-weight: bold;
`;
