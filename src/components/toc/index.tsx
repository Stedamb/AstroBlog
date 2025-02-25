/*
 * @Author: kim
 * @Description: Table of Contents
 */
import type { MarkdownHeading } from 'astro';
import classNames from 'classnames';

interface TocProps {
  className?: string;
  listClassName?: string;
  dataSource?: MarkdownHeading[];
}

function Toc(props: TocProps) {
  const { dataSource = [], className, listClassName } = props;
  const listClasses = classNames('text-text-light', listClassName);

  return (
    !!dataSource.length && (
      <div className={className}>
        <nav className="h-full w-full overflow-scroll">
          <ul className={listClasses}>
            {dataSource
              .filter((item) => item.depth > 1)
              .map((item) => {
                return (
                  <li key={item.slug}>
                    <a
                      className="inline-block cursor-pointer py-1 transition-colors hover:text-text"
                      style={{ marginLeft: `${(item.depth - 2) * 8}px` }}
                      href={`#${item.slug}`}
                    >
                      {item.text}
                    </a>
                  </li>
                );
              })}
          </ul>
        </nav>
      </div>
    )
  );
}

export default Toc;
