export const UserHistory = () => {
  // win, lose, and draw
  return (
    <div className="border-2 p-2 rounded-md">
      <h3 className="text-lg font-semibold underline underline-offset-2">
        User History:
      </h3>
      <ul className="mt-2 space-y-2">
        <li>
          <div className="flex justify-between">
            <div>
              <p>
                Bo1 with{" "}
                <span className="italic font-medium">Other player</span>
              </p>
              <p className="font-semibold text-green-500">Win</p>
            </div>
            <div>
              <p>
                at: <span className="italic">17:18 16-Jun-2024</span>
              </p>
            </div>
          </div>
        </li>
        <li>
          <div className="flex justify-between">
            <div>
              <p>
                Bo3 with{" "}
                <span className="italic font-medium">Other player</span>
              </p>
              <p className="font-semibold text-rose-500">Lose</p>
            </div>
            <div>
              <p>
                at: <span className="italic">17:18 16-Jun-2024</span>
              </p>
            </div>
          </div>
        </li>
      </ul>
    </div>
  );
};
