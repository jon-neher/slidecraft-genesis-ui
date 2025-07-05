-- Check for any remaining UUID constraints on user_id columns
SELECT 
    tc.table_name,
    tc.column_name,
    tc.constraint_name,
    tc.constraint_type,
    cc.check_clause
FROM information_schema.table_constraints tc
JOIN information_schema.constraint_column_usage cu ON tc.constraint_name = cu.constraint_name
LEFT JOIN information_schema.check_constraints cc ON tc.constraint_name = cc.constraint_name
WHERE cu.column_name LIKE '%user_id%' 
AND tc.table_schema = 'public'
AND (tc.constraint_type = 'CHECK' OR cc.check_clause LIKE '%uuid%');

-- Check for foreign key constraints that might reference auth.users
SELECT 
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name,
    tc.constraint_name
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
    AND tc.table_schema = 'public'
    AND (kcu.column_name LIKE '%user_id%' OR ccu.table_name = 'users');